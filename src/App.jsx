import { useState } from 'react'
import axios from 'axios'
import './app.css'


function App() {
  const [ user, setUser ] = useState({
    username: '',
    password: ''
  }) 

  const [ token, setToken ] = useState('')
  const [ isLogin, setIsLogin ] = useState(false)
  const [ products, setProducts ] = useState([])
  const [ productDetail, setProductDetail ] = useState()
  const [ mainImg, setMainImg ] = useState('')
  


  const baseUrl = import.meta.env.VITE_BASE_URL
  const apiPath = import.meta.env.VITE_API_PATH

  // 監聽登入 input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUser({
      ...user,
      [name]: value
    })
  }

  // 登入
  async function handleLogin (e){
    e.preventDefault()
    try {
      const res = await axios.post(
        `${baseUrl}/v2/admin/signin`,
        user
      )
      console.log('res',res.data)
      const token = res.data.token
      setToken(token)
      setIsLogin(true)
      getProductsAll(token)
    } catch (err) {
      alert(`登入失敗`)
      console.log(err)
    }
  }

    // 登入驗證
    async function handleLoginCheck (){
      try {
        const res = await axios.post(
          `${baseUrl}/v2/api/user/check`,
          {},
          { headers: { Authorization:token } }
        )
        alert('已登入')
      } catch (err) {
        alert(`未登入`)
        console.log(err)
      }
    }

  // fn 取得全部產品
  async function getProductsAll(token) {
    try {
      const res = await axios.get(
        `${baseUrl}/v2/api/${apiPath}/admin/products`,
        { headers: { Authorization: token } }
      )
      const productsData = res.data.products
      productsData.forEach((productData)=>{
        if(productData.imagesUrl){
          productData.imagesUrl.unshift(productData.imageUrl)
        }else{
          productData.imagesUrl = [productData.imageUrl]
        }
      })
      setProducts(productsData)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      { isLogin 
        ? 
        <div className="container mt-3">
          <div className="row">
            <div className="col-7">
              <button type="button" className="btn btn-primary" onClick={()=>{
                handleLoginCheck()
              }}>登入驗證</button>
              <h1 className="h2">產品列表</h1>
              <table className='table'>
                <thead>
                  <tr>
                    <th scope="col">項次</th>
                    <th scope="col">產品名稱</th>
                    <th scope="col">原價</th>
                    <th scope="col">特價</th>
                    <th scope="col">是否啟用</th>
                    <th scope="col">產品細節</th>
                  </tr>
                </thead>
                <tbody>
                  { products.map((product,index) => (
                      <tr key={product.id}>
                          <th scope="row">{index+1}</th>
                          <td className="limited-width-title">{product.title}</td>
                          <td>{product.origin_price}</td>
                          <td>{product.price}</td>
                          <td>{product.num ? "啟用" : "非啟用"}</td>
                          <td>
                            <button type="button" className="btn btn-primary" onClick={() => {
                              setProductDetail(product)
                              setMainImg(product.imageUrl)
                            }}>細節</button>
                          </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            <div className="col-5">
              <h1 className="h2">產品細節</h1>
              {
                productDetail
                ?
                <div className="card d-flex justify-content-center">
                  <div className="text-center">
                    <img className="card-img-top main-img" src={mainImg} alt="商品圖片"></img>
                  </div>
                  <div className="card-body">
                    <div className="card-title">
                      <h2 className="h4">{productDetail.title} <span className="badge text-bg-primary">{productDetail.category}</span> </h2>
                    </div>

                      <p className="card-text">{productDetail.content}</p>
                      <p className="card-text">商品描述：{productDetail.description}</p>
                      <p className="card-text">商品數量：{productDetail.num} {productDetail.unit}</p>
                      <p className="card-text">
                        <del className="text-secondary">{productDetail.origin_price}元</del>／{productDetail.price}元
                      </p>
                      <h2 className="h4">更多圖片</h2>
                      { productDetail.imagesUrl
                        ?
                        productDetail.imagesUrl.map((img)=> (
                          <img src={img} alt="更多圖片" key={img} className="more-img me-2 mb-2" onClick={()=>{
                            setMainImg(img)
                          }
                          }/>
                        ))
                        :
                        <div className="text-secondary">暫時沒有更多圖</div>
                      }
                      </div>
                    </div>
                :
                "點選產品即可查看細節"
              }
            </div>
          </div>
        </div>
        :
        <div className="container">
          {/* align-items-center 
          當你使用 align-items-center 時，彈性盒子容器的子元素會在交叉軸（垂直軸）上居中對齊。這意味著子元素的寬度將根據其內容進行調整，而不是佔滿父容器的寬度。
          */}
          <div className="d-flex justify-content-center  flex-column align-items-center vh-100">
            <h1 className='h3 mb-3'>會員登入</h1>
            
            <form className='text-center' onSubmit={handleLogin}>
              <div className="form-floating mb-3">
                <input  type="email" id="email" className="form-control" placeholder="user@gmail.com" name="username" onChange={handleInputChange}></input>
                <label htmlFor="email">email</label>
              </div>

              <div className="form-floating mb-3">
                {/* placeholder 浮動的佔位符，填入提示文字
                    且 input 需放在前面才可抓到兄弟選擇器
                */}
                <input type="password" id="password" className="form-control" placeholder="password" name="password" onChange={handleInputChange}/>
                <label htmlFor="password">password</label>
              </div>

              <button type="submit" className='btn btn-primary w-100' >登入</button>
            </form>
          </div>
        </div>
      }
        
    </>
  )
}

export default App
