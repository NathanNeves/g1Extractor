const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs-extra');


async function takeData(termo,pagina){
        let noticias = new Array();
        //2007 é quando as primeiras noticias do g1 foram publicadas
        for(let i=2007;i<new Date().getFullYear()+1;i++){
            for(let n = 1;n<pagina;n++){
                let termosQuebrados = termo.split(' ');
                if(termosQuebrados.length >1){
                    termo = termosQuebrados.join('+');
                }
                let url = `https://g1.globo.com/busca/?q=${termo}&order=recent&from=${i}-01-01T00%3A00%3A00-0300&to=${i}-12-31T23%3A59%3A59-0300&page=${n}&ajax=1`;
                try{
                    let html =  await  axios.get(url);
                    const $ = cheerio.load(html.data);
                    //se não houverem resultados, acabaram as noticias no ano então o loop é quebrado
                    if($('.widget--no-results').length){
                        break;
                    }
                    $('.widget--info__title').each((i,elem)=>{
                        let tituloNoticia = elem.children[0].data;
                        console.log(tituloNoticia);
                        let url = $(elem).closest("a").attr('href');
                        noticias.push({
                            titulo:tituloNoticia.replace(/(\r\n|\n|\r|\\n)/gm, '').trim(),
                            classificacao:'undefined',
                            url
                        });
                    })
                }
                catch(e){
                    //se houver um erro o loop é quebrado
                    console.log(e);
                    break;
                }

            }
        }
    await fs.writeJson(`${termo}.json`,noticias);


}

takeData('travesti assassinada');
