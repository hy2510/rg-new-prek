import tempIntro from '@assets/temp/img_temp_intro.png'

export default function MainView() {
  return (
    <>
      <img
        src={tempIntro}
        alt="intro"
        style={{ width: '100%', height: '100%' }}
      />

      <div
        style={{
          position: 'absolute',
          left: '0',
          bottom: '60px',
          width: '100%',
          height: '30px',
          textAlign: 'center',
          color: 'black',
          fontWeight: 'bold',
          border: '1px solid red',
        }}
      >
        프~~~~~~~~~로~~~~~~~~그~~~~~~~~~~레~~~~~~~~~스~~~~~~~~~~바~~~~~~~~
      </div>
    </>
  )
}
