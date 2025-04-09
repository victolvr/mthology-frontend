document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://mythology-backend.onrender.com/api"
    const demigodModal = document.getElementById("demigodModal")
    const demigodForm = document.getElementById("demigodForm")
    const addDemigodBtn = document.getElementById("addDemigodBtn")
    const modalTitleDemigod = document.getElementById("modalTitleDemigod")
    let editDemigodId = null
  
    // Função para carregar semideuses
    const loadDemigods = async () => {
      try {
        const response = await fetch(`${apiUrl}/demigods`)
        const demigods = await response.json()
        const tableBody = document.querySelector("#demigodsTable tbody")
        tableBody.innerHTML = ""
  
        demigods.forEach((demigod) => {
          const row = document.createElement("tr")
          row.innerHTML = `
                      <td>${demigod.name}</td>
                      <td>${demigod.description}</td>
                      <td>${demigod.parent ? demigod.parent.name : "N/A"}</td>
                      <td>
                          <button class="editDemigodBtn" data-id="${demigod._id}">Editar</button>
                          <button class="deleteDemigodBtn" data-id="${demigod._id}">Deletar</button>
                      </td>
                  `
          tableBody.appendChild(row)
        })
  
        // Adicionar eventos de edição e deleção
        document.querySelectorAll(".editDemigodBtn").forEach((button) => {
          button.addEventListener("click", (e) => openEditDemigodModal(e.target.dataset.id))
        })
  
        document.querySelectorAll(".deleteDemigodBtn").forEach((button) => {
          button.addEventListener("click", (e) => deleteDemigod(e.target.dataset.id))
        })
      } catch (error) {
      }
    }
  
    // Função para adicionar semideus
    const addDemigod = async (demigod) => {
      try {
        const response = await fetch(`${apiUrl}/demigods`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(demigod),
        })
  
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Erro ao adicionar semideus")
        }
  
        loadDemigods()
      } catch (error) {
        console.error("Erro ao adicionar semideus:", error)
        alert(error.message || "Erro ao adicionar semideus")
      }
    }
  
    // Função para atualizar semideus
    const updateDemigod = async (id, demigod) => {
      try {
        const response = await fetch(`${apiUrl}/demigods/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(demigod),
        })
  
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Erro ao atualizar semideus")
        }
  
        loadDemigods()
      } catch (error) {
        console.error("Erro ao atualizar semideus:", error)
        alert(error.message || "Erro ao atualizar semideus")
      }
    }
  
    // Função para deletar semideus
    const deleteDemigod = async (id) => {
      if (!confirm("Tem certeza que deseja deletar este semideus?")) return
  
      try {
        const response = await fetch(`${apiUrl}/demigods/${id}`, {
          method: "DELETE",
        })
  
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Erro ao deletar semideus")
        }
  
        loadDemigods()
      } catch (error) {
        console.error("Erro ao deletar semideus:", error)
        alert(error.message || "Erro ao deletar semideus")
      }
    }
  
    // Abrir modal para editar semideus
    const openEditDemigodModal = async (id) => {
      editDemigodId = id
      modalTitleDemigod.innerText = "Editar Semideus"
  
      try {
        // Buscar os dados do semideus para preencher o modal
        const response = await fetch(`${apiUrl}/demigods/${id}`)
  
        if (!response.ok) {
          throw new Error("Semideus não encontrado")
        }
  
        const demigod = await response.json()
  
        document.getElementById("nameDemigod").value = demigod.name
        document.getElementById("description").value = demigod.description
        await loadGods(demigod.parent ? demigod.parent._id : null)
  
        demigodModal.style.display = "block"
      } catch (error) {
        console.error("Erro ao buscar semideus:", error)
        alert("Erro ao buscar dados do semideus")
      }
    }
  
    // Abrir modal para adicionar novo semideus
    const openAddDemigodModal = async () => {
      editDemigodId = null
      modalTitleDemigod.innerText = "Adicionar Semideus"
      demigodForm.reset()
      await loadGods() // Carrega os deuses sem pré-selecionar nenhum
      demigodModal.style.display = "block"
      console.log("Modal de adicionar semideus aberto")
    }
  
    // Carregar deuses para o select de pai/mãe
    const loadGods = async (selectedGodId = null) => {
      try {
        const response = await fetch(`${apiUrl}/gods`)
        const gods = await response.json()
        const select = document.getElementById("parent")
        select.innerHTML = "" // Limpa o select
  
        gods.forEach((god) => {
          const option = document.createElement("option")
          option.value = god._id
          option.text = god.name
          if (god._id === selectedGodId) {
            option.selected = true
          }
          select.appendChild(option)
        })
      } catch (error) {
      }
    }
  
    // Fechar modal ao clicar no "x"
    document.querySelector(".close").addEventListener("click", () => {
      demigodModal.style.display = "none"
    })
  
    // Fechar modal ao clicar fora dele
    window.addEventListener("click", (event) => {
      if (event.target === demigodModal) {
        demigodModal.style.display = "none"
      }
    })
  
    // Submissão do formulário
    demigodForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const demigodData = {
        name: document.getElementById("nameDemigod").value,
        description: document.getElementById("description").value,
        parent: document.getElementById("parent").value,
      }
  
      if (editDemigodId) {
        await updateDemigod(editDemigodId, demigodData)
      } else {
        await addDemigod(demigodData)
      }
  
      demigodModal.style.display = "none"
    })
  
    // Inicializando o carregamento de semideuses e eventos
    addDemigodBtn.addEventListener("click", () => {
      console.log("Botão Adicionar Semideus clicado")
      openAddDemigodModal()
    })
  
    loadDemigods()
  })
  