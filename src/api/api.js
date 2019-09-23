import axios from 'axios'
import { Message } from 'element-ui';
axios.defaults.baseURL='http://api.tianchic.com'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const ajax={
    post:function(url,data ={}){
        return new Promise( (resolve ,reject) => {
            axios.post(url,data)
            .then( (response) => {
                resolve(response)
            })
            .catch ( (error) => {
                reject(error)
            })
        })
    },

    get:function( url ,params={}){
        return new Promise ( (resolve ,reject) => {
            axios.get(url,{
                params:params
            })
            .then( (response) => {
                resolve(response)
            })
            .catch ((error)=> {
                reject(error)
            })
        })
    },
    put:function (url ,data={}){
        return new Promise( (resolve, reject) => {
            axios.put(url,data)
            .then( (response) => {
                 resolve(response)
            })
            .catch( (error) => {
                reject(error)
            })
        })
    },

    del:function(url ,params={}){
        return new Promise((resolve,reject) => {
            axios.delete(url,{
                params:params
            })
            .then( (response) => {
            	resolve(response) 
            }).catch ( (error) => {
                reject(error)
            })
        })
    }
}
export default ajax;
