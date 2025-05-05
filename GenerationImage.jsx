import { useState, useEffect } from 'react'

function App() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedImages, setGeneratedImages] = useState([])
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    setDarkMode(localStorage.getItem('darkMode') === 'true')
    setGeneratedImages(
      JSON.parse(localStorage.getItem('generatedImages')) || []
    )
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    localStorage.setItem('generatedImages', JSON.stringify(generatedImages))
  }, [darkMode, generatedImages])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Введите описание изображения')
      return
    }

    setLoading(true)
    setError('')
    setImage(null)

    const API_ENDPOINTS = [
      'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    ]

    try {
      let lastError = null

      for (const endpoint of API_ENDPOINTS) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer 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',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: prompt,
              negative_prompt: negativePrompt || undefined,
              options: { wait_for_model: true },
            }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(
              errorData.error || `HTTP error! status: ${response.status}`
            )
          }

          const blob = await response.blob()
          const url = URL.createObjectURL(blob)
          setImage(url)
          setGeneratedImages(prev => [url, ...prev.slice(0, 9)])
          return
        } catch (err) {
          lastError = err
          console.warn(`Ошибка на ${endpoint}:`, err)
        }
      }

      throw lastError || new Error('Все API endpoints недоступны')
    } catch (err) {
      let message = 'Ошибка генерации изображения'
      if (err.message.includes('rate limit'))
        message = 'Превышен лимит запросов. Попробуйте позже.'
      else if (err.message.includes('model is loading'))
        message = 'Модель загружается. Подождите 1-2 минуты.'
      else message = err.message

      setError(message)
      console.error('Ошибка:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    setGeneratedImages([])
    setImage(null)
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      } transition-colors duration-300`}
    >
      <header className='bg-gradient-to-r from-indigo-600 to-blue-400 text-white py-8 shadow-lg'>
        <div className='container mx-auto flex justify-between items-center px-4'>
          <h1 className='text-3xl font-bold'>AI Генератор Изображений</h1>
          <button onClick={toggleDarkMode} className='p-2 border rounded-full'>
            {darkMode ? 'Dark' : 'Light'}
          </button>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col justify-center lg:flex-row gap-8'>
          <div
            className={`w-full lg:w-4xl p-6 rounded-xl shadow-md ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <label className='block mb-2'>Описание изображения *</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              disabled={loading}
              placeholder="Например: 'Красивый закат на море, цифровая живопись'"
              className='w-full p-3 mb-4 border rounded'
              rows={4}
            />

            <label className='block mb-2'>Что исключить (необязательно)</label>
            <textarea
              value={negativePrompt}
              onChange={e => setNegativePrompt(e.target.value)}
              disabled={loading}
              placeholder='размыто,  плохого качество'
              className='w-full p-3 mb-4 border rounded'
              rows={3}
            />

            <button
              onClick={generateImage}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Генерация...' : 'Создать изображение'}
            </button>

            {error && (
              <div className='mt-4 p-3 bg-red-100 text-red-700 rounded'>
                {error}
              </div>
            )}
          <div className='w-full lg:w-2/3 space-y-6'>
            {image ? (
              <div
                className={`p-6 rounded-xl shadow-md ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <img
                  src={image}
                  alt='Сгенерированное'
                  className='w-full rounded-lg mb-4'
                />
                <div className='flex gap-4'>
                  <button
                    onClick={() => setImage(null)}
                    className='bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500'
                  >
                    Сбросить
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`p-10 mt-10 w-210 text-center rounded-xl shadow-md ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <p className='text-lg'>
                  Пока ничего не создано. Введите описание и жмите кнопку.
                </p>
              </div>
            )}
          </div>
          </div>

        </div>

        {generatedImages.length > 0 && (
          <div
            className={`mt-8 p-6 rounded-xl shadow-md ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className='flex justify-between mb-4'>
              <h3 className='font-bold text-lg'>История</h3>
              <button
                onClick={clearHistory}
                className='text-sm px-3 py-1 bg-gray-300 rounded hover:bg-gray-400'
              >
                Очистить
              </button>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
              {generatedImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  onClick={() => setImage(img)}
                  className='cursor-pointer rounded shadow-sm border'
                  alt={`История ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
