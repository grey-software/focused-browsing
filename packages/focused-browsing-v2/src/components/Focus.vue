<template>
    <div>
        <h1>Hello World</h1>
        <p>Focused Browsing coming soon</p>
        <button type="button" @click="sendToBackground">Un-Focus</button>
    </div>
</template>
<script>
export default {
    data(){
        return{
            
        }
    },
    methods: {
        sendToBackground() {
            chrome.runtime.sendMessage({status: "focus"}, function(response) {
                console.log(response);
            });
        }

    }
    
}
</script>