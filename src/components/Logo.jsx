import lightThemeLogo from '../assets/light-theme-logo.png'

function Logo({height = '30px', width = 'auto'}) {
  return (
    <div>
        <img src={lightThemeLogo} alt="coding sena logo" style={{width: width, height: height}} />
    </div>
  )
}

export default Logo