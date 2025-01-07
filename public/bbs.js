"use strict";

let number=0;
let num = 0;
let reply_target = null;
const bbs = document.querySelector('#bbs');

document.querySelector('#name').addEventListener('change', (event) => {
    document.querySelector('#pre_name').innerText = document.querySelector('#name').value;
});

document.querySelector('#message').addEventListener('change', (event) => {
    document.querySelector('#pre_mes').innerText = document.querySelector('#message').value;
});

document.querySelector('#image').addEventListener('change', (event) => {
    const file = event.target.files[0]
    let img_area = document.querySelector('#pre_img');
    if (!file) img_area.src = "";
    else {
        img_area.src = URL.createObjectURL(file);
        URL.revokeObjectURL(file);
    }
});

document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;
    const image = document.querySelector('#image').files[0];
    const like = 0;
    const reply = reply_target;
    
    let imageDataURL = "";
    if(image) imageDataURL=URL.createObjectURL(image);
    console.log(imageDataURL);
    const params = {  // URL Encode
        method: "POST",
        body:  'name='+name+'&message='+message+'&image='+encodeURIComponent(imageDataURL)+'&like='+like+'&reply='+reply,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    console.log( params );
    const url = "/post";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        console.log( response );
        document.querySelector('#message').value = "";
        document.querySelector('#image').value = "";
        document.querySelector('#pre_mes').innerText = "";
        document.querySelector('#pre_img').src = "";
    });
    URL.revokeObjectURL(image);
});

function push_like(id){
    const params = {
        method: "POST",
        body: 'id='+id,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/like";
    fetch( url, params )
    .then( (response)=> {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        let value = response.like;
        console.log( id+'_like_is_'+value );
        let target = '#like'+id;
        document.querySelector(target).innerText=response.like;
    });
}

function select_reply(already, numeric){
    let element = document.querySelector('#pre_reply')
    if(element) element.remove();
    if(reply_target === numeric){
        already.checked = false;
        reply_target = null;       
    } else {
        reply_target = numeric;
        const params = {
            method: "POST",
            body: 'id='+reply_target,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const url = "/reply";
        fetch( url, params)
        .then( (response) =>{
            if( !response.ok ) {
                throw new Error('Error');
            }
            return response.json();
        })
        .then( (response) =>{
            let mes = response.message;
            let reply = document.createElement('div');
            reply.id = "pre_reply";
            reply.className = "reply"

            let reply_num = document.createElement('span');
            reply_num.className = 'num';
            reply_num.innerText = reply_target+'：';

            let reply_name = document.createElement('span');
            reply_name.className = 'name';
            reply_name.innerText = mes.name;

            let reply_mes = document.createElement('p');
            reply_mes.className = 'mes';
            reply_mes.innerText = mes.message;
                              
            reply.appendChild( reply_num );
            reply.appendChild( reply_name );
            reply.appendChild( document.createElement('br') );
            reply.appendChild( reply_mes );
            reply.appendChild( document.createElement('br') );

            document.querySelector("#pre_mes").before(reply);
        })
    }
}

document.querySelector('#check').addEventListener('click', () => {
    const params = {  // URL Encode
        method: "POST",
        body:  '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/check";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        let value = response.number;
        console.log( value );

        console.log( number );
        if( number != value ) {
            const params = {
                method: "POST",
                body: 'start='+number,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'               
                }
            }
            const url = "/read";
            fetch( url, params )
            .then( (response) => {
                if( !response.ok ) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then( (response) => {
                number += response.messages.length;
                for( let mes of response.messages ) {
                    console.log( mes );  // 表示する投稿
                    let cover = document.createElement('div');
                    cover.className = 'cover';
                    cover.id = num;

                    let num_area = document.createElement('span');
                    num_area.className = 'num';
                    num_area.innerText = num+'：';

                    let name_area = document.createElement('span');
                    name_area.className = 'name';
                    name_area.innerText = mes.name;

                    let mes_area = document.createElement('p');
                    mes_area.className = 'mes';
                    mes_area.innerText = mes.message;

                    let img_area = document.createElement('img');
                    img_area.className = 'img';
                    img_area.src = mes.image;

                    let like_area = document.createElement('button');
                    like_area.type = "button";
                    like_area.id = 'push'+num;
                    like_area.setAttribute('onclick', 'push_like('+num+')');
                    like_area.innerText = '♡';

                    let like2_area = document.createElement('span');
                    like2_area.id = 'like'+num;
                    like2_area.className = 'like';
                    like2_area.innerText = String(0);

                    let reply_area = document.createElement('input');
                    reply_area.type = "radio";
                    reply_area.name = "do";
                    //reply_area.id = 'reply'+num;
                    reply_area.setAttribute('onclick', 'select_reply(this,'+num+')');
                    //reply_area.innerText = '返信';

                    let reply2_area = document.createElement('span');
                    reply2_area.innerText = "返信";
                                      
                    cover.appendChild( num_area );
                    cover.appendChild( name_area );
                    cover.appendChild( document.createElement('br') );
                    cover.appendChild( mes_area );
                    cover.appendChild( document.createElement('br') );
                    cover.appendChild( img_area );
                    cover.appendChild( document.createElement('br') );
                    cover.appendChild( like_area );
                    cover.appendChild( like2_area );
                    cover.appendChild( reply_area );
                    cover.appendChild( reply2_area );

                    if(mes.reply !== 'null'){
                        const params = {
                            method: "POST",
                            body: 'id='+mes.reply,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        };

                        const url = "/reply";
                        fetch( url, params)
                        .then( (response) =>{
                            if( !response.ok ) {
                                throw new Error('Error');
                            }
                            return response.json();
                        })
                        .then( (response) =>{
                            let mes2 = response.message;
                            let reply = document.createElement('div');
                            reply.id = "reply"+num;
                            reply.className = "reply"

                            let reply_num = document.createElement('span');
                            reply_num.className = 'num';
                            reply_num.innerText = mes.reply+'：';

                            let reply_name = document.createElement('span');
                            reply_name.className = 'name';
                            reply_name.innerText = mes2.name;

                            let reply_mes = document.createElement('p');
                            reply_mes.className = 'mes';
                            reply_mes.innerText = mes2.message;
                                            
                            reply.appendChild( reply_num );
                            reply.appendChild( reply_name );
                            reply.appendChild( document.createElement('br') );
                            reply.appendChild( reply_mes );
                            reply.appendChild( document.createElement('br') );
                            mes_area.before( reply );
                            
                        })
                    }

                    num++;
                    bbs.appendChild( cover );
                }
            })
        }
    });
});