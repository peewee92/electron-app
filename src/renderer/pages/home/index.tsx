import { useNavigate } from 'react-router-dom'
import './home.less'

function Home() {
    // 创建路由钩子
    const navigate = useNavigate()
    const onBack = () => {
        navigate('/login')
    }
    return (
        <div>
            home
            <div onClick={onBack}>back</div>
        </div>
    )
}


export default Home