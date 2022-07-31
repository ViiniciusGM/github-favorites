import { githubSearch } from "./GithubSearch.js"

export class Favorites{
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
  }

  save(){
    localStorage.setItem('@github-names', JSON.stringify(this.entries))
  } 

  async add(value){
    try{
      const userExist = this.entries.find(entry => entry.login === value)
      
      if(userExist){
        throw new Error("O usuário já existe")
      }
      
      const user = await githubSearch.search(value)
      
      if(user.login === undefined){
        throw new Error("Usuário não encontrado")
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch(e){
      alert(e.message)
    }

  }

  load(){
    this.entries = JSON.parse(localStorage.getItem('@github-names')) || []
  }


  delete(user){
    const entried = this.entries
    .filter(entry => entry.login !== user.login)

    this.entries = entried
    this.save()
    this.update()
  }
}

export class FavoritesView extends Favorites{
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('tbody')

    this.update()
    this.btnadd()
  }


  btnadd(){
    const addButton = this.root.querySelector('.search-btn')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('#input-search')

      this.add(value)
    }
  }

  update(){
    this.removeAllTr()
      this.entries.forEach( user => {
        const row = this.createRow()

        row.querySelector('.ico img').src = `https://github.com/${user.login}.png`
        row.querySelector('.ico a').href = `https://github.com/${user.login}`
        row.querySelector('.ico a').innerHTML = `${user.name}`
        row.querySelector('.ico span').innerHTML = `${user.login}`
        
        row.querySelector('.repositorios span').innerHTML = `${user.public_repos}`
        
        row.querySelector('.seguidores span').innerHTML = `${user.followers}`

        row.querySelector('.remove button').addEventListener('click', () =>{
          const confirmed = confirm("Tem certeze que deseja deletar essa linha?")

            if(confirmed){
              this.delete(user)
            }
        })

        this.tbody.append(row)
      })

      let tbl = document.getElementById("table").rows.length

      if(tbl == 1){
        const emptRow = this.imageTable();
        this.tbody.append(emptRow);
      }
  }

  imageTable(){
    const trImg = document.createElement('tr')

    trImg.innerHTML = `
      <td class="empt-list" colspan="4">
      <div class="table-empty">
        <img src="images/tablestar.svg" class="img-empty">
        <span>Nenhum favorito ainda</span>
      </div>
    </td>   
    `
    return trImg
  }



  createRow(){
    const tr = document.createElement('tr')
  
    tr.innerHTML = `
      <td>
        <div class="ico">
          <img src="https://avatars.githubusercontent.com/u/92201792?v=4" alt="" srcset="">
             <div class="names">
             <a href="" target="_blank">viinicius</a>
                <div class="gitname">/<span>vinicius</span></div>
        </div>
      </td>

          <td>
            <div class="repositorios">
              <span>123</span>
            </div>
          </td>

          <td>
            <div class="seguidores">
              <span>1234</span>
            </div>
          </td>

          <td>
            <div class="remove">
              <button>Remover</button>
            </div>
          </td>
      </td>
    `

    return tr
  }

  removeAllTr(){


    this.tbody.querySelectorAll('tr')
    .forEach((tr)=>{
      tr.remove()
    })
  }

}