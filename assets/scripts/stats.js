const { createApp } = Vue

createApp({
    data() {
        return {
            events:null,
            eventsStats:null,
            pastEvents:null,
            pastEventsStats:null,
            upEvents:null,
            upEventsStats:null,
            loadError:false,
        }
    },
    created(){
        fetch("https://mindhub-xj03.onrender.com/api/amazing")
        .then(res=>res.json())
        .then(res=>{
            // this.categories=[... new Set(this.events.map(event=>event.category))]
            // this.filteredEvents=this.events;
            this.FilterEvents(res);
            this.eventsStats=this.CalculateEventsStats();
            this.pastEventsStats=this.CalculateCatStats(this.pastEvents);
            this.upEventsStats=this.CalculateCatStats(this.upEvents);
        })
        .catch(err=>{
            this.loadError=true;
        })
    },
    methods:{
        FilterEvents(data){
            this.events=data.events;
            this.pastEvents=data.events.filter(event=>event.date<data.currentDate);
            this.upEvents=data.events.filter(event=>event.date>data.currentDate);
        },
        CalculateEventsStats(){
            return [[this.GetMax(),this.GetMin(),this.GetMaxCap()]]
        },
        CalculateCatStats(data){
            let categories=this.ParseCategories(data);
            return categories.map(cat=>{
                let catInfo= data.filter(event=>event.category===cat);
                return catInfo.reduce((acu,elem,index)=>{
                    if(!index){
                        acu[0]=elem.category;
                    }
                    acu[1]+= (elem.assistance ?? elem.estimate)*elem.price;
                    acu[2]+= (elem.assistance ?? elem.estimate)/elem.capacity*100;
                    if (index===catInfo.length-1){
                        acu[1]= "$"+acu[1];
                        acu[2]= "%"+ (acu[2]/catInfo.length).toFixed(2);
                    }
                    return acu;
                },["category",0,0])
            });
        },
        ParseCategories(data){
            let categories= data.map(event=>event.category);
            return Array.from(new Set(categories));
        },
        GetMax(){
            let maxEvent=this.pastEvents.sort((a,b)=>{
                return (b.assistance*100/b.capacity)-(a.assistance*100/a.capacity);
            });
            return `<span>${maxEvent[0].name} :</span> %${(maxEvent[0].assistance*100/maxEvent[0].capacity).toFixed(2)}`;
        },
        GetMin(){
            let minEvent=this.pastEvents.sort((a,b)=>{
                return (a.assistance*100/a.capacity)-(b.assistance*100/b.capacity);
            });
            return `<span>${minEvent[0].name} :</span> %${(minEvent[0].assistance*100/minEvent[0].capacity).toFixed(2)}`;
        },
        GetMaxCap(){
            let maxCapEv=this.events.sort((a,b)=> b.capacity-a.capacity);
            return `<span>${maxCapEv[0].name} :</span> ${maxCapEv[0].capacity}`;
        }

    }
}).mount('#app')