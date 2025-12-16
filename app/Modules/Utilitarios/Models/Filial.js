const Model = use("Model")

class Filial extends Model{
      static boot(){
          super.boot()
          this.addTrait("@provider:Auditable")
      }
}
module.exports=Filial