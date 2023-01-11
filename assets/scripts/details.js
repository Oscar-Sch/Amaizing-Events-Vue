const { createApp } = Vue

createApp({
    data() {
        return {
            event:null,
            loadError:false,
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
        .then(res=>res.json())
        .then(res=>{
            this.event=this.GetEventById(res.events);
        })
        .catch(err=>{
            this.loadError=true;
        })
    },
    methods:{
        GetEventById(events){
            const parameterSearch= new URLSearchParams(location.search);
            const id=parameterSearch.get("id");
            return events.find(event=> event._id===id);
        }
    }
}).mount('#app')