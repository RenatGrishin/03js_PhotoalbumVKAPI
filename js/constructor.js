let loadScrollProgress = false; // загружается ли контент?

let view = {
    /* устанавливаем навигацию */
    setNavigation: function(selected){
        let headerDiv = document.querySelector('.nav');
        headerDiv.insertAdjacentHTML('afterbegin', `<div class="navGalery" onclick="controller.openMainPage()"><img src="./image/01.png"></div> <div class="navUpload" onclick="controller.OpenUploadPhotoPage()"><img src="./image/06.png"></div>`);
        let cls = ''
        if(selected==`Upload`){
            cls = '.navUpload';
        }else{
            cls = '.navGalery'
        }
        document.querySelector(cls).setAttribute('id', 'nav-div-selected')
    },
    /* устанавливаем заголовок */
    setHeader: function(name, param=''){
        let headerDiv = document.querySelector('.header');
        headerDiv.insertAdjacentHTML('afterbegin', `<h3 ${param}>${name}</h3>`);
    },
    
    /* Устанавливаем список альбомов */
    setAlbum: function(title, size, updated, thumb_src, onClick){
        let albumDiv = document.querySelector('.photoAlbum-Body');

        albumDiv.insertAdjacentHTML('afterbegin', `<div onclick="${onClick}" class="album"><div class="albumIMG"><img src="${thumb_src}"></div><h2>${title}</h2><span class="size"><img src="./image/10.png">${size} files</span><span class="updated"><img src="./image/11.png">${updated}</span><div class="albumArrow"><img src="./image/09.png"></div></div>`)
    },
    
    /* Устанавливаем фотки в альбом */
    setPhotosInAlbum: function(imgSrc, photoId, paramA, paramB){
        let albumDiv = document.querySelector('.photoAlbum-Body');
        
        albumDiv.insertAdjacentHTML('beforeend', `<div class="photoInAlbum"><div><a ${paramA}>✓<span>Select</span></a></div><img id="${photoId}" ${paramB} src="${imgSrc}"></div>`)
    },
    
    /* Очищаем Main древо */
    clearMain: function (){
        let nav = document.querySelector('.nav');
        let header = document.querySelector('.header');
        let photoalbumBody = document.querySelector('.photoAlbum-Body');
        
        while(nav.firstChild){
            nav.removeChild(nav.firstChild)
        }
        while(header.firstChild){
            header.removeChild(header.firstChild)
        }
        while(photoalbumBody.firstChild){
            photoalbumBody.removeChild(photoalbumBody.firstChild)
        }
    },
    
    /* Страница с фоткой */
    OpenPhoto: function(imgSrc, fileName, date, text){
        let albumDiv = document.querySelector('.photoAlbum-Body');
        albumDiv.insertAdjacentHTML('afterbegin', `<div class="photoDescription"><div class="image"><img src="${imgSrc}"></div><div class="info"><div><h5>File Name: &nbsp;</h5><p>${fileName}</p></div><div><h5>Дата загрузки: &nbsp;</h5><p>${date}</p></div></div></div>`)
        console.log(text)
        
        if(text){
            let infoDiv = document.querySelector('.info');
            infoDiv.insertAdjacentHTML('beforeend', `<div><h5>Описание: &nbsp;</h5><p>${text}</p></div>`)
        }
    },
    
    /* Создание tooptip окна */
    CreateTooptipWindow: function(marginTop, marginLeft, fileName, date, text){
        let photoAlbumDiv = document.querySelector('.photoAlbum-Body');
        
        photoAlbumDiv.insertAdjacentHTML('afterbegin', `<div class="tooptipDiv"><div class="tooptipDivArrow"></div><div class="tooptipBody"><div><h5>File Name: &nbsp;</h5><p>${fileName}</p></div><div><h5>Date: &nbsp;</h5><p>${date}</p></div></div></div>`)
        
        let tooptipBody = document.querySelector('.tooptipBody')
        if(text){
            tooptipBody.insertAdjacentHTML('beforeend', `<div><h5>Caption: &nbsp;</h5><p>${text}</p></div>`)
        }
        
        let tooptipDiv = document.querySelector('.tooptipDiv');
        let tooptipDivArrow = document.querySelector('.tooptipDivArrow');
        tooptipDiv.style.top = `${marginTop+106}px`;
        tooptipDivArrow.style.marginLeft = `${marginLeft+74}px`;
    },
    DeleteToopripWindow: function(element){
        document.querySelector(element).remove();
    },
    
    /* страница с загрузкой фото */
    UploadPhotoPage: function(albums){
        let uploadPage = document.querySelector('.photoAlbum-Body')
        
        uploadPage.insertAdjacentHTML('beforeend', `<div id="uplSelFoldDiv"><p>Select a folder</p><form><select name="uploadPhotoSelect" class="uploadPhotoSelect"></select></form></div>`)
        
        let uplPhotSel = document.querySelector('.uploadPhotoSelect')
        for(let i=0 ; i<albums.length ; i++){
            uplPhotSel.insertAdjacentHTML('beforeend', `<option value="${albums[i].id}">${albums[i].title}</option>`)
        }
    },
    
    /* Поле загрузки Drag and Drop */
    DragAndDrop: function(){
        let uploadPage = document.querySelector('.photoAlbum-Body');
        
        uploadPage.insertAdjacentHTML(`beforeend`, `<div id="drop-area"><p id="drop-text">Drop files or <input id="drop-browse" type="file" multiple accept="image/*"> <label class="drop-browse-label" for="drop-browse">browse</label> to upload</p><form class="my-form"><div id="gallery"></div></form></div>`)
    },
    
    /* Показать фото превью */
    PreviewFile: function(file, id){
        let reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = function(){
            let areaPhotos = document.getElementById('gallery');
            areaPhotos.insertAdjacentHTML(`beforeend`, `<div class="uplPhotoDiv" id="${id}"><div><img src="${reader.result}"></div><div id="uplPhotoStatus"><p>Waiting...</p></div></div>`)
        }
    }
}

let model = {
    token: '121677045f72f7e266ea22e65f43c0f229bda1ca83cbfa6cde3aaaa939e825f1e8f189f5ede8d6d5f5dd5',

    AuthVkAPI: async function(){
        let clientId = 7576288;
        let guardKey = 'ZDtSZsqD5V3IoopRMQM4';
        let serviceKey = '484b3a10484b3a10484b3a10054838a0f04484b484b3a1017084216d61a152a2fd7d0df';
        let score = 'account,photos';
        let redirect = 'http://lynxart.ru/index.html';
        //let redirect = 'https://oauth.vk.com/blank.html';

        let url = `https://oauth.vk.com/authorize?client_id=${clientId}&display=page&redirect_uri=${redirect}&response_type=token&state&v=5.52&scope=${score}`;
        console.log(url)
        return url;
    },
    
    /* API запрос */
    ajaxQuey: async function(urlQuery){
        let ajax = await $.ajax({
            url: `https://api.vk.com/method/${urlQuery}&v=5.52&access_token=` + controller.token,
            method: 'GET',
            dataType: 'JSONP',
            success: function (data){
                return data;
            }
        });
        return ajax;
    },
    
    /* API отправка файла */
    ajaxPost: async function(urlQuery){
        let ajax = await $.ajax({
            url: `https://api.vk.com/method/${urlQuery}&v=5.52&access_token=` + controller.token,
            method: 'POST',
            dataType: 'JSONP',
            success: function(data){
            }
        });
        return ajax;
    },
    
    /* Получить URL */
    ajaxPostForm: async function(url, fd, idPhoto){
        let loadingDiv = document.querySelector(`#${idPhoto} #uplPhotoStatus`)
        console.log(fd)
        let ajax = await $.ajax({
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                /* выводим отчет о загрузки */
                
                xhr.upload.onprogress = function(event){
                    if(loadingDiv.getElementsByTagName(`p`)){
                        loadingDiv.removeChild(loadingDiv.firstChild)
                        loadingDiv.insertAdjacentHTML(`beforeend`, `<div id="loadProgress"></div>`)
                    }
                    console.log(event.loaded +' / '+ event.total)
                    let progress = loadingDiv.querySelector(`#loadProgress`);
                    progress.style.width = `0%`
                    progress.style.width = event.loaded / event.total * 100 + `%`
                }
                xhr.upload.onload = function (){
                    loadingDiv.removeChild(loadingDiv.firstChild);
                    loadingDiv.insertAdjacentHTML(`beforeend`, `<p>Complete</p>`)
                    document.querySelector(`#${idPhoto}`).style.opacity = 100+'%';
                }
                return xhr;
            },
            url: `https://cors-anywhere.herokuapp.com/${url}`,
            method: 'POST',
            data: fd,
            processData: false,
            contentType: false
        });
        return JSON.parse(ajax)
    },
    
    /* Преобразование даты */
    getDate: function(date){
        let unixDate = new Date(date*1000);
        return unixDate.getDate() +'.'+ unixDate.getMonth() +'.'+ unixDate.getFullYear();
    },
    
    /* Проверка, закончился ли экран при скроле вниз */
    screenAtTheBottom: function (){
        if($(window).scrollTop() + document.body.clientHeight >= $(document).height() && !loadScrollProgress) {
            return true;
        }
    },
    
    /* Размер картики в зависимости от размера окна */
    GetSizeForPhoto: function(){
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        if( (width<807) || (height<807) ) return 604;
        if( (width>807 && width<1080) || (height>807 && height<1024) ) return 807;
        if( (width>=1080) || (height>=1024) ) return 1280;
    },
    
    /* Tooptip координаты */
    GetCoordinateElement: function(idElement){
        let element = document.querySelector(`#photo_${idElement}`)
        return{
            top: element.getBoundingClientRect().top + document.body.scrollTop,
            left: element.getBoundingClientRect().left
        }
    },
    
    /* Вытаскиваем из URL имя файла */
    GetNameFromURL: function(url){
        if(url){
            let urlArray = url.split('/');
            let name = urlArray.pop()
            return name
        }
        //let urlArray = url.split('/');
        //let name = urlArray.pop()
        return url;
    },
    
    /* Drag And Drop */
    DragAndDrop: function(){
        let dropArea = document.getElementById('drop-area');
    
        /* блочу левые события */
        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false)
        })
        function preventDefaults (e) {
            e.preventDefault()
            e.stopPropagation()
        }
    
        ;['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false)
        })
        ;['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhightlight, false)
        })
        function highlight(e){
            dropArea.classList.add('highlight')
        }
        function unhightlight(e){
            dropArea.classList.remove('highlight')
        }

        dropArea.addEventListener('drop', handleDrop, false)
        function handleDrop(e){
            let dt = e.dataTransfer
            let files = dt.files

            model.HandleFiles(files)
        }
    },
    
    /* Событие при дропе или расшариванию */
    HandleFiles: function(files){
        console.log(files)
        files = [...files]
        files.forEach(element => controller.PreviewFile(element))
    },
    
    /* Загрузка фото. Получить ID выбранного альбома из списка*/
    SelectedAlbumID: function(){
        let form = document.querySelector(`.uploadPhotoSelect`)
        let index = form.selectedIndex
        let id = form.options[index].value
        return id;
    },
    
    /* Заменить стандартное действие элемента на функцию */
    SetAtributeElement: function(element, tag, func){
        let tegA = document.querySelector(element)
        tegA.setAttribute(tag, func)
    },

    /* возращает токен из адресной строки */
    GetToken: async function () {
        console.log('getToken')
        let url_href = new URL(document.location).hash.split('&');
        console.log(url_href)
        if(url_href[0]){
            console.log('url_href - YES:')
            console.log(url_href)
            let url_token = url_href[0].split('=');
            if(url_token[1]){
                console.log('url_token - YES: '+ url_token[1])
                return url_token[1];
            }
        }else{
            console.log('url_href - NO')
            let link = await model.AuthVkAPI();
            window.location.href = link;
        }
    },
    getCookie: function (cookie_name){
        let results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
        if ( results ){
            console.log(results)
            return ( unescape ( results[2] ) )
        }else{
            return null
        }
    }
}

let controller = {
    pageSection: 'Main', // Какая страница открыта.
    albumID: 0, // Записываем то какой открыт альбом
    startLoadContent: 50, // с какой фотки начинается загрузка фото
    uploadAlbumId: 276410952, // В какой альбом загрузить фото
    uploadIdPhoto: 0,
    token: '',
    
    /* Создаем шапку (имя пользователя, название альбома или фото) */
    createHeader: async function(){
        let user = await model.ajaxQuey(`account.getProfileInfo?`);
        console.log(user)
        view.setHeader(`Welcome, ${user.response.first_name}.`)
    },
    
    /* Создаем список альбомов */
    createAlbum: async function(){
        let albums = await model.ajaxQuey(`photos.getAlbums?need_covers=1`);
        console.log(albums)
        
        albums.response.items.map(albumsInfo=>(view.setAlbum(albumsInfo.title, albumsInfo.size, model.getDate(albumsInfo.updated), albumsInfo.thumb_src, `controller.openAlbum(${albumsInfo.id})`)))
    },
    
    /* Открывается главная страница */
    openMainPage: async function(){
        view.clearMain();
        this.startLoadContent = 50;
        this.albumID = 0;
        this.pageSection = 'Main';
        this.createHeader();
        this.createAlbum();
        view.setNavigation(this.pageSection);
    },
    
    /* Открывается альбом с фотками */
    openAlbum: async function(album_ids){
        console.log(album_ids)
        this.pageSection = 'Album';
        
        let albumName = await model.ajaxQuey(`photos.getAlbums?album_ids=${album_ids}`)
        
        view.clearMain()
        view.setNavigation(this.pageSection);
        view.setHeader('<span><img id="arrow-back" src="./image/08.png"><img id="arrow-folder" src="./image/07.png">'+ albumName.response.items[0].title +'</span>', `onclick="controller.openMainPage()"`)
        
        let photosInAlbums = await model.ajaxQuey(`photos.get?album_id=${album_ids}&count=${this.startLoadContent}`)
        
        console.log(photosInAlbums)
        
        photosInAlbums.response.items.map(photos=>(
            view.setPhotosInAlbum(
            photos.photo_604, 
            `photo_${photos.id}`, 
            `onclick="controller.OpenPhoto(${photos.id})"`, 
            `onmouseover="controller.ShowTooptip(${photos.id}, '${model.GetNameFromURL(photos.photo_75)}', '${model.getDate(photos.date)}', '${photos.text}')" onmouseout="controller.DeleteTooptip('.tooptipDiv')"`
        )))
        console.log(photosInAlbums.response.items[0])
        
        this.albumID = album_ids;
        this.loadScrollProgress = false;
    },
    
    /* Подгрузка следующих фото при скроле вниз */
    LoadScrollContent: async function(){
        let screenCheck = model.screenAtTheBottom()
        
        if(screenCheck){
            this.loadScrollProgress = true;
            
            let query = await model.ajaxQuey(`photos.get?album_id=${this.albumID}&count=50&offset=${this.startLoadContent}`, `controller.OpenPhoto()`);
            console.log(this.albumID)
            console.log(query)
            query.response.items.map(photos=>(
                view.setPhotosInAlbum(
                    photos.photo_604, 
                    `photo_${photos.id}`, 
                    `onclick="controller.OpenPhoto(${photos.id})"`, 
                    `onmouseover="controller.ShowTooptip(${photos.id}, '${model.GetNameFromURL(photos.photo_807)}', '${model.getDate(photos.date)}', '${photos.text}')" onmouseout="controller.DeleteTooptip('.tooptipDiv')"`
                )
            ))
            
            this.startLoadContent += 50;
            loadScrollProgress = false;
        }
    },
    /* Создаем Tooptip окно */
    ShowTooptip: async function(idElement, name, date, text){
        let coordinate = model.GetCoordinateElement(idElement);
        view.CreateTooptipWindow(coordinate.top, coordinate.left, name, date, text);
    },
    DeleteTooptip: function(element){
        view.DeleteToopripWindow(element)
    },
    
    /* страница с фотографией */
    OpenPhoto: async function(photoID){
        this.startLoadContent = 50;
        this.pageSection = 'Photo';
        let photoSize = model.GetSizeForPhoto()
        
        let photoResponse = await model.ajaxQuey(`photos.get?album_id=${this.albumID}&photo_ids=${photoID}`)
        let photo = photoResponse.response.items[0]
        
        let date = model.getDate(photo.date)
        
        console.log(photo)
        
        view.clearMain();
        view.setNavigation(this.pageSection);
        view.setHeader(`<span><img id="arrow-back" src="./image/08.png"> ${photo.id}` +'</span>', `onclick="controller.openAlbum(${photo.album_id})"`)
        switch(photoSize){
            case 604: 
                view.OpenPhoto(photo.photo_604, model.GetNameFromURL(photo.photo_604), date, photo.text);
            break;
            case 807:
                view.OpenPhoto(photo.photo_807, model.GetNameFromURL(photo.photo_807), date, photo.text);
            break;
            case 1280:
                view.OpenPhoto(photo.photo_1280, model.GetNameFromURL(photo.photo_1280), date, photo.text);
            break;
               }
    },
    
    /* Загрузить фотографию в альбом */
    OpenUploadPhotoPage: async function(){
        this.pageSection = 'Upload';
        let albums = await model.ajaxQuey('photos.getAlbums?')
        
        view.clearMain();
        view.setNavigation(this.pageSection);
        view.UploadPhotoPage(albums.response.items);
        view.DragAndDrop();
        model.DragAndDrop();
        model.SetAtributeElement(`#drop-browse`, `onchange`, `model.HandleFiles(this.files)`)
    },
    
    /* Загрузка фото в Альбом */
    UploadFile: async function(file, idPhoto){
        let dropText = document.querySelector(`#drop-text`);
        if(dropText){dropText.remove()}
        
        console.log(model.SelectedAlbumID())
        
        let url = await model.ajaxPost(`photos.getUploadServer?album_id=${model.SelectedAlbumID()}`)
        let formData = new FormData();    
        formData.append('file', file)
            
        let uploadInfo = await model.ajaxPostForm(`${url.response.upload_url}`, formData, idPhoto)
            
        console.log(uploadInfo)
            
        let aaa = await model.ajaxPost(`photos.save?server=${uploadInfo.server}&photos_list=${uploadInfo.photos_list}&aid=${uploadInfo.aid}&hash=${uploadInfo.hash}&album_id=${model.SelectedAlbumID()}`)
            
        console.log(aaa)
    },
    PreviewFile: async function(element){
        document.querySelector(`.uploadPhotoSelect`).setAttribute(`disabled`, `disabled`)
        
        this.uploadIdPhoto++;
        let id = `uplPhoto_${this.uploadIdPhoto}`;
        view.PreviewFile(element, id);
        await controller.UploadFile(element, id);
    },

    /* Запуск приложения */
    StartApp: async function(){
        if(document.cookie){
            document.cookie = `token=${await model.GetToken()}; expiress=''`;
            let cookies = model.getCookie('token')
            this.token = cookies
            console.log('cookies: ' + document.cookie)
            console.log('this.token: ' + this.token)
            this.openMainPage();
            console.log('cookie YES: ' + this.token)
        }else{
            console.log('cookie NO: ' + document.cookie)
            document.cookie = model.GetToken();
        }
    },
}

controller.StartApp();

/* проверка скрола */
$(window).scroll(function(){
    if(controller.pageSection == 'Album'){
        controller.LoadScrollContent()
    }
})
