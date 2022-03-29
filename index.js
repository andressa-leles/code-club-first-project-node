const { response } = require('express')
const { request } = require('express')
const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json()) // PADRÃO PARA AVISAR O EXPRESS QUE VAMOS USAR O JSON

/*
  - Query params => meusite.com/users?nome=rodolfo&age=28 // Filtros
  - Route params => /users/2         // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
  - Request Body => {"name": "Andressa", "age":}

  - GET          => Buscar informações no back-end
  - POST         => Criar informações no back-end 
  - PUT / PATCH  => Alterar/Atualizar informações no back-end
  - DELETE       => Deletar informações no back-end

  - Middleware   => INTERCEPTADOR => Tem o poder de parar ou alterar dados de requisição
*/
const users = []


const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }

    request.userIndex = index
    request.userId = id

    next()

}

app.get('/users', (request, response) => {

    return response.json(users)

})


app.post('/users', (request, response) => {
try {
    const { name, age } = request.body

    if(age < 18) throw new Error("Only allowed users over 18 years old")

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user)
} catch(err){
    return response.status(400).json({error: err.message})
} 
})


app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateUser = { id, name, age }

    users[index] = updateUser

    return response.json(updateUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()

})



app.listen(port, () => {
    console.log(`🚀 Server starded on port ${port}`)
})