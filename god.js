document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:3000/api"
    const godModal = document.getElementById("godModal")
    const godForm = document.getElementById("godForm")
    const addGodBtn = document.getElementById("addGodBtn")
    const modalTitle = document.getElementById("modalTitle")
    let editGodId = null
  
    // Função para carregar deuses
    const loadGods = async () => {
      try {
        const response = await fetch(`${apiUrl}/gods`)
        const gods = await response.json()
        const tableBody = document.querySelector("#godsTable tbody")
        tableBody.innerHTML = ""
  
        gods.forEach((god) => {
          const row = document.createElement("tr")
          row.innerHTML = `
                      <td>${god.name}</td>
                      <td>${god.profile === "admin" ? "Olimpiano" : "Deus"}</td>
                      <td>
                          <button class="editGodBtn" data-id="${god._id}">Editar</button>
                          <button class="deleteGodBtn" data-id="${god._id}">Deletar</button>
                      </td>
                  `
          tableBody.appendChild(row)
        })
  
        // Adicionar eventos de edição e deleção
        document.querySelectorAll(".editGodBtn").forEach((button) => {
          button.addEventListener("click", (e) => openEditGodModal(e.target.dataset.id))
        })
  
        document.querySelectorAll(".deleteGodBtn").forEach((button) => {
          button.addEventListener("click", (e) => deleteGod(e.target.dataset.id))
        })
      } catch (error) {
      }
    }
  
    // Função para adicionar deus
    const addGod = async (god) => {
      try {
        const response = await fetch(`${apiUrl}/gods`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(god),
        })
  
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Erro ao adicionar deus")
        }
  
        loadGods()
      } catch (error) {
        console.error("Erro ao adicionar deus:", error)
        alert(error.message || "Erro ao adicionar deus")
      }
    }
  
    // Função para atualizar deus
    const updateGod = async (id, god) => {
      try {
        const response = await fetch(`${apiUrl}/gods/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(god),
        })
  
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Erro ao atualizar deus")
        }
  
        loadGods()
      } catch (error) {
        console.error("Erro ao atualizar deus:", error)
        alert(error.message || "Erro ao atualizar deus")
      }
    }
  
    // Função para deletar deus
    const deleteGod = async (id) => {
      if (!confirm("Tem certeza que deseja deletar este deus?")) return
  
      try {
        const response = await fetch(`${apiUrl}/gods/${id}`, {
          method: "DELETE",
        })
  
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Erro ao deletar deus")
        }
  
        loadGods()
      } catch (error) {
        console.error("Erro ao deletar deus:", error)
        alert(error.message || "Erro ao deletar deus")
      }
    }
  
    // Abrir modal para editar deus
    const openEditGodModal = async (id) => {
      editGodId = id
      modalTitle.innerText = "Editar Deus"
  
      try {
        // Buscar os dados do deus para preencher o modal
        const response = await fetch(`${apiUrl}/gods/${id}`)
  
        if (!response.ok) {
          throw new Error("Deus não encontrado")
        }
  
        const god = await response.json()
  
        document.getElementById("name").value = god.name
        document.getElementById("profile").value = god.profile
        document.getElementById("password").value = "" // Não exibir senha
  
        godModal.style.display = "block"
      } catch (error) {
        console.error("Erro ao buscar deus:", error)
        alert("Erro ao buscar dados do deus")
      }
    }
  
    // Abrir modal para adicionar novo deus
    const openAddGodModal = () => {
      editGodId = null
      modalTitle.innerText = "Adicionar Deus"
      godForm.reset()
      godModal.style.display = "block"
      console.log("Modal de adicionar deus aberto")
    }
  
    // Fechar modal ao clicar no "x"
    document.querySelector(".close").addEventListener("click", () => {
      godModal.style.display = "none"
    })
  
    // Fechar modal ao clicar fora dele
    window.addEventListener("click", (event) => {
      if (event.target === godModal) {
        godModal.style.display = "none"
      }
    })
  
    // Submissão do formulário
    godForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const godData = {
        name: document.getElementById("name").value,
        profile: document.getElementById("profile").value,
        password: document.getElementById("password").value,
      }
  
      if (editGodId) {
        await updateGod(editGodId, godData)
      } else {
        await addGod(godData)
      }
  
      godModal.style.display = "none"
    })
  
    // Inicializando o carregamento de deuses e eventos
    addGodBtn.addEventListener("click", () => {
      console.log("Botão Adicionar Deus clicado")
      openAddGodModal()
    })
  
    loadGods()
  })
  