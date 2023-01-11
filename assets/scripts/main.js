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
        }
    },
    created(){
        const title=document.querySelector("h1").innerHTML;
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
        .then(res=>res.json())
        .then(res=>{
            if (title==="Home"){
                this.events=res.events;
            }
            if (title==="Upcoming Events"){
                this.events=res.events.filter(event=>event.date>res.currentDate);
            }
            if (title==="Past Events"){
                this.events=res.events.filter(event=>event.date<res.currentDate);
            }
            this.categories=[... new Set(this.events.map(event=>event.category))]
            this.filteredEvents=this.events;
        })
        .catch(err=>{
            this.loadError=true;
        })
    },
    methods:{
        CrossFilter(){
            console.log("asdasd")
            let searchFilter= this.events.filter(event=> event.name.toLowerCase().includes(this.searchValue.toLowerCase()));
            console.log(searchFilter)
            if(this.checkedCategories.length!==0){
                this.filteredEvents= searchFilter.filter(event=> this.checkedCategories.includes(event.category));
            }else{
                this.filteredEvents=searchFilter;
            }
        }
    }
}).mount('#app')