(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTime(mili) {
        const min = Math.floor(mili / 60000);
        const sec = Math.floor((mili % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function patio() {
        function read() {
            console.log(localStorage.patio ? JSON.parse(localStorage.patio) : []);
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function save(veiculos) {
            localStorage.setItem('patio', JSON.stringify(veiculos));
        }
        function addVehicle(veiculo, saveBd) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">X</button>
                </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remove(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (saveBd)
                save([...read(), veiculo]);
        }
        function remove(placa) {
            const { entrada, nome } = read().find(veiculo => veiculo.placa === placa);
            const time = calcTime(new Date().getTime() - new Date(entrada).getTime());
            if (confirm(`O Veículo ${nome} permaneceu por ${time}. Deseja encerrar?`)) {
                save(read().filter(veiculo => veiculo.placa !== placa));
                render();
            }
            else {
                return;
            }
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = read();
            if (patio.length) {
                patio.forEach(veiculo => addVehicle(veiculo));
            }
        }
        return { read, addVehicle, remove, save, render };
    }
    patio().render();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios!");
            return;
        }
        patio().addVehicle({ nome, placa, entrada: new Date().toISOString() }, true);
    });
})();
