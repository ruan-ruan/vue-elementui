import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui';
axios.defaults.baseURL='http://api.tianchi.com'
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
              data:params
          })
            .then( (response) => {
                resolve(response)
            })
            .catch ((error)=> {
                reject(error)
            })
        })
    }
}
export default ajax;
