import useRouterElements from './routes/elements'

function App() {
  const elements = useRouterElements()
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {elements}
    </div>
  )
}

export default App