export class VariableModel{
    constructor(props){
        this.name = props.name
        this.type = props.type
        this.val = props.val
    }

    get name(){ return this._name }
    get type(){ return this._type }
    get val(){ return this._val }
    set name(v){ this._name = v }
    set type(v){ this._type = v }
    set val(v){ this._val = v }
}

export default VariableModel