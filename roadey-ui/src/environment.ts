export let roadeyBaseUrl:string
//this is the only env we get in front end, and technically anyone that downloads the site can read it 
if(process.env['NODE_ENV'] === 'production'){
    //if we ran npm run build
    //use the deployed address
    roadeyBaseUrl = 'http://34.98.120.200' // Domain Name URL goes here (deployed)
}else {
    //we are in test or dev, use the local address
    roadeyBaseUrl = 'http://localhost:2006'
}
