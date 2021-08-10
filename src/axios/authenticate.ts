// import repository from './repository';


// export async function login(user) {
//     const res = await repository.post('login',user).catch(error => error.response)
//     if(res.status === 200) {
//         setUser(res.data.user)
//         localStorage.setItem('token', res.data.token);
//         // user種別に応じて遷移先を変更
//         if(res.data.user.user_type === 0) {
//             router.push('/admin')
//         } else if(res.data.user.user_type === 1) {
//             router.push('/dep-admin')
//         } else {
//             router.push('/')
//         }
//     } else if(res.status === 422) {
//         setErrorMessage(res.data.errors.message)
//     } else {
//         setHttpStatus(res.status)
//     }
//     return null;
// }