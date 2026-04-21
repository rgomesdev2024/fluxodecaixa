document.getElementById("form").addEventListener("submit", e=>{
e.preventDefault()
salvar()
})

async function salvar(){

let descricao = document.getElementById("descricao").value
let valor = parseFloat(document.getElementById("valor").value)
let tipo = document.getElementById("tipo").value
let data = document.getElementById("data").value
let plataforma = document.getElementById("plataforma").value

let taxa = 0

if(plataforma == "ifood") taxa = valor * 0.23
if(plataforma == "99food") taxa = valor * 0.20

let liquido = valor - taxa

await supabaseClient.from("transacoes").insert({
descricao,
valor,
tipo,
data,
plataforma,
taxa,
liquido
})

carregar()
}

async function carregar(){

let {data} = await supabaseClient
.from("transacoes")
.select("*")
.order("data",{ascending:false})

let html = ""

let vendas = 0
let gastos = 0

data.forEach(item=>{

if(item.tipo == "entrada"){
vendas += item.valor
}else{
gastos += item.valor
}

html += `
<tr>
<td>${item.data}</td>
<td>${item.descricao}</td>
<td>${item.plataforma}</td>
<td>R$ ${item.valor.toFixed(2)}</td>
<td>R$ ${(item.taxa || 0).toFixed(2)}</td>
<td>R$ ${(item.liquido || item.valor).toFixed(2)}</td>
</tr>
`
})

let lucro = vendas - gastos

document.getElementById("contasMes").innerHTML = html
document.getElementById("vendas").innerText = vendas.toFixed(2)
document.getElementById("gastos").innerText = gastos.toFixed(2)
document.getElementById("lucro").innerText = lucro.toFixed(2)

gerarGrafico(vendas,gastos)
gerarRelatorio(data)
}

function gerarGrafico(vendas,gastos){

new Chart(document.getElementById("grafico"),{
type:"bar",
data:{
labels:["Vendas","Gastos"],
datasets:[{data:[vendas,gastos]}]
}
})
}

function gerarRelatorio(data){

let meses = {}

data.forEach(item=>{

let mes = item.data.substr(0,7)

if(!meses[mes]){
meses[mes] = {entrada:0,saida:0}
}

if(item.tipo == "entrada"){
meses[mes].entrada += item.valor
}else{
meses[mes].saida += item.valor
}

})

let html = ""

for(let m in meses){

let lucro = meses[m].entrada - meses[m].saida

html += `
<tr>
<td>${m}</td>
<td>R$ ${meses[m].entrada.toFixed(2)}</td>
<td>R$ ${meses[m].saida.toFixed(2)}</td>
<td>R$ ${lucro.toFixed(2)}</td>
</tr>
`
}

document.getElementById("relatorio").innerHTML = html
}

carregar()
