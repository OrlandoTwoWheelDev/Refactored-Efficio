import Dashboard from './Dashboard.jsx'

const Homepage = () => {

  const token = localStorage.getItem('token');

  return(
    <>
    {token ? <Dashboard /> 
    :
    <section id='greeting'>
    <h1>Welcome to Efficio! 📝 </h1>
    <h3>Login or Register to get to work!</h3>
    </section>}
   

    </>
  )
}

export default Homepage; 