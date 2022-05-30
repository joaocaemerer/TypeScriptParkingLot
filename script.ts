interface Veiculo {
    nome: string,
    placa: string,
    entrada: Date | string;
}

(function() {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTime(mili:number) {
        const min = Math.floor(mili/60000);
        const sec = Math.floor((mili % 60000) / 1000);

        return `${min}m e ${sec}s`;
    }

    function patio() {
        function read(): Veiculo[] {
            console.log(localStorage.patio ? JSON.parse(localStorage.patio) : []);
            
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        
        function save(veiculos: Veiculo[]) {
            localStorage.setItem('patio', JSON.stringify(veiculos));
        }

        function addVehicle(veiculo: Veiculo, saveBd?: boolean) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">X</button>
                </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function(){
                remove(this.dataset.placa);
            });

            $("#patio")?.appendChild(row);

            if(saveBd)save([...read(), veiculo])
        }

        function remove(placa: string) {
            const {entrada, nome} = read().find(veiculo => veiculo.placa === placa);
            const time = calcTime(new Date().getTime() - new Date(entrada).getTime());

            if(confirm(`O Veículo ${nome} permaneceu por ${time}. Deseja encerrar?`)){
                save(read().filter(veiculo => veiculo.placa !== placa));
                render();
            } else{
                return;
            }

        }

        function render() {
            $("#patio")!.innerHTML = "";
            const patio = read();

            if(patio.length){
                patio.forEach(veiculo => addVehicle(veiculo));
            }
        }

        return{ read, addVehicle, remove, save, render}
    }

    patio().render();
    $("#cadastrar")?.addEventListener('click', () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;        
        
        if(!nome || !placa){
            alert("Os campos nome e placa são obrigatórios!");
            return;
        }

        patio().addVehicle({nome, placa, entrada: new Date().toISOString()}, true);

    })
})();