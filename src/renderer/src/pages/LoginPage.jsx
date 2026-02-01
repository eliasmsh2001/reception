import LoginForm from '../components/EssentialComponents/LoginForm'
import bgImage from '../assets/loginBg.jfif'
import logo from '../assets/images.jpg'

const LoginPage = () => {
  return (
    <main className="w-screen h-screen relative flex ">
      <div className="w-screen bg-black ">
        <img className="w-full h-full opacity-25 blur-[1px]" src={bgImage} alt="" />
      </div>

      <div
        className={`h-[50rem] flex flex-col items-center justify-start pt-24 gap-10 bg-white shadow-2xl shadow-white w-[30rem] 
          fixed right-10 rounded-b-xl overflow-hidden `}
      >
        <img src={logo} className="size-44" alt="" />
        <div className="text-center font-bold text-mainText text-lg e">
          <h1>العيادة المجمعة زاوية الدهماني</h1>
          <h1>الإستعلامات</h1>
        </div>

        <LoginForm />
      </div>
    </main>
  )
}

export default LoginPage
