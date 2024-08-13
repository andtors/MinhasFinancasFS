import 'bootswatch/dist/flatly/bootstrap.css'
import './custom.css'
import { Route, Routes } from 'react-router-dom'
import LocalStorageService from './services/localStorageService'

import 'toastr/build/toastr.min.js'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import CadastroUsuario from './pages/CadastroUsuario'
import ConsultaLancamentos from './pages/ConsultaLancamentos'
import CadastroLancamentos from './pages/CadastroLancamentos'
import EditandoLancamento from './pages/EditandoLancamento'
import LandingPage from './pages/LandingPage'

import 'toastr/build/toastr.css'


function App() {

  const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
  
  const isUserAuth = () => {
    if(usuarioLogado !== null){
      return true
    } else {
      return false
    }
  }

  console.log(isUserAuth())
  return (
    <div className='container'>
     <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CadastroUsuario />} />
          <Route path="/home" element={!isUserAuth() ?  <Login /> : <Home />} />
          <Route path="/lancamentos" element={!isUserAuth() ?  <Login /> : <ConsultaLancamentos />} />
          <Route path="/cadastro-lancamentos" element={!isUserAuth() ?  <Login /> :  <CadastroLancamentos />} />
          <Route path="/editando-lancamento/:id" element={!isUserAuth() ? <Login /> : <EditandoLancamento />} />
        </Routes>
    </div>
  )
}

export default App
