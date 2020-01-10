const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

async function takeData(termo){
    try{
        for(let i=2007;i<2021;i++){    
                for(let n = 1;n<36;n++){
                let url = `https://g1.globo.com/busca/?q=${termo}&order=recent&from=${i}-01-01T00%3A00%3A00-0300&to=${i}-12-31T23%3A59%3A59-0300&page=${n}&ajax=1`;
                let html =  await  axios.get(url);
                const $ = cheerio.load(html.data);
                if($('.widget--no-results').length){
                    break;
                }
                $('.widget--info__title').each((i,elem)=>{
                    console.log(elem.children[0].data);
                })  
            }
        }

    }catch(e){
        console.log(e);
    }

}

takeData('homofobia');