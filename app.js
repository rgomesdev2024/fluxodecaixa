async function salvar(){

let descricao = document.getElementById("descricao").value
let valor = parseFloat(document.getElementById("valor").value)
let tipo = document.getElementById("tipo").value
let data = document.getElementById("data").value
let parcelas = parseInt(document.getElementById("parcelas").value) || 1
let recorrente = document.getElementById("recorrente").checked

if(tipo == "cartao"){

let valorParcela = valor / parcelas

for(let i=1;i<=parcelas;i++){

let dataParcela = new Date(data)

dataParcela.setMonth(dataParcela.getMonth() + i - 1)

await supabaseClient.from("transacoes").insert({

descricao,
valor:valorParcela,
tipo:"cartao",
data:dataParcela,
parcelas:parcelas,
parcela_atual:i,
recorrente:false

})

}

}

else{

await supabaseClient.from("transacoes").insert({

descricao,
valor,
tipo,
data,
parcelas:1,
parcela_atual:1,
recorrente

})

}

carregar()

}

async function carregar(){

let {data} = await supabaseClient

.from("transacoes")

.select("*")

.order("data",{ascending:false})

let html = ""
let saldo = 0

data.forEach(item=>{

let classe = ""

if(item.tipo == "entrada"){

saldo += item.valor
classe = "text-success"

}

else{

saldo -= item.valor
classe = "text-danger"

}

html += `

<tr>

<td>${item.data}</td>

<td>${item.descricao}</td>

<td class="${classe}">
R$ ${item.valor.toFixed(2)}
</td>

<td>${item.tipo}</td>

<td>${item.parcela_atual}/${item.parcelas}</td>

</tr>

`

})

document.getElementById("lista").innerHTML = html

document.getElementById("saldo").innerText =
"R$ "+saldo.toFixed(2)

}

carregar()