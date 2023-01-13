const { createApp } = Vue

createApp({
    data() {
        return {
            events:null,
            filteredEvents:null,
            categories:[],
            checkedCategories:[],
            searchValue:"",
            loadError:false,
            favList:[],
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
        .then(res=>res.json())
        .then(res=>{
            this.CheckActualPage(res);
            this.categories=[... new Set(this.events.map(event=>event.category))]
            this.filteredEvents=this.events;
            if(localStorage.getItem("Favorites")){
                this.favList= JSON.parse(localStorage.getItem("Favorites"));
            }
            console.log(JSON.parse(localStorage.getItem("Favorites")))
            console.log(this.favList)
        })
        .catch(err=>{
            this.loadError=true;
        })
    },
    methods:{
        CheckActualPage(data){
            const title=document.querySelector("h1").innerHTML;
            if (title==="Home"){
                this.events=data.events;
            }
            if (title==="Upcoming Events"){
                this.events=data.events.filter(event=>event.date>data.currentDate);
            }
            if (title==="Past Events"){
                this.events=data.events.filter(event=>event.date<data.currentDate);
            }
        },
        CrossFilter(){
            console.log("asdasd")
            let searchFilter= this.events.filter(event=> event.name.toLowerCase().includes(this.searchValue.toLowerCase()));
            let checkFilter= searchFilter.filter(event=> this.checkedCategories.includes(event.category));
            if(this.checkedCategories.length!==0){
                this.filteredEvents= checkFilter;
            }else{
                this.filteredEvents=searchFilter;
            }
        },
        HandleFav(event){
            if(!this.favList.some(ev=>ev._id===event._id)){
                this.favList.push(event);
            }else{
                this.favList=this.favList.filter(ev=>ev._id!==event._id);
            }
            localStorage.setItem("Favorites", JSON.stringify(this.favList))
        },
        FavButton(event){
            if(this.favList.some(ev=>ev._id===event._id)){
                return 'fav-container saved'
            }
            return 'fav-container'
        },
        ClearFavs(){
            this.favList=[];
            localStorage.setItem("Favorites", JSON.stringify(this.favList))
        }
    }
}).mount('#app')