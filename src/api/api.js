import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui';
axios.defaults.baseURL='http://api.tianchic.com'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
<<<<<<< HEAD
=======
//axios.defaults.baseURL = $core.use('http://api.tianchic.com'); //确认协议和地址
>>>>>>> 5b740847ca35294f15f873631bf141eaef8d67c5
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
<<<<<<< HEAD
            axios.delete(url,{
                params:params
            })
            .then( (response) => {
            	resolve(response) 
            }).catch ( (error) => {
=======
          axios.delete(url,{
                params:params
            })
            .then( (response) => {
                resolve(response)
            })
            .catch ((error)=> {
>>>>>>> 5b740847ca35294f15f873631bf141eaef8d67c5
                reject(error)
            })
        })
    }
}
export default ajax;
