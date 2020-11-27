import axios from 'axios'
import API from '@/api/apiPro'

export function emailSpecValidator (rule, value, callback) {
    axios.get(API.emailSpec + value)
        .then(res => {
            if (res.data.code === 0) {
                callback();
            } else {
                callback(new Error("邮箱已经被注册"));
            }
        })
        .catch(err => {
            console.log(err);
        })
}

export function emailFormatValidator (rule, value, callback) {
    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (reg.test(value)) {
        callback();
    } else {
        callback(new Error("邮箱格式错误"))
    }
}

export function passwordFormatValidator (rule, value, callback) {
    let reg = /^[a-zA-Z]\w{5,17}$/;
    if (reg.test(value)) {
        callback();
    } else {
        callback(new Error("密码以字母开头，长度在6～18之间"));
    }
}

export function usernameSpecValidator (rule, value, callback) {
    axios.get(API.usernameSpec + value)
        .then(res => {
            if (res.data.code === 0) {
                callback();
            } else {
                callback(new Error("用户名已经被注册"))
            }
        })
        .catch(err => {
            console.log(err);
        })
}

export function usernameFormatValidator (rule, value, callback) {
    let reg = /^[a-zA-Z0-9_]{3,16}$/;
    if (reg.test(value)) {
        callback();
    } else {
        callback(new Error("用户名长度3～16位，支持字母数字和下划线"));
    }
}
