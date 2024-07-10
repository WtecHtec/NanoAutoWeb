import axios from 'axios'

const baseURL = 'http://localhost:3000'

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000
})

export const post = (url: string, data: any): Promise<[number, any]> => {
  return new Promise((resolve) => {
    axiosInstance.post(url, data)
      .then(res => {
        console.log('post:', res.data)
        const { code } = res.data
        resolve([code, res.data])
      })
      .catch(err => {
        resolve([-1, err])
      })
  })
}
