export class TypedFunction {
    name: string;
    func: (...any) => any;
    argumentTypes: TypedArgument[];

    constructor(f: (...any) => any, al: TypedArgument[], name: string ) {
        this.func = f;
        this.argumentTypes = al; 
        this.name = name;
    }
}

export class TypedArgument {
    name: string;
    typeName: string;

    constructor(name: string, typeName : string = 'var') {
        this.name = name;
        this.typeName = typeName;
    }
}

export class ReplicatedExpression {
    value: any;
    replicationGuides: number[];

    constructor(v: any, rgl: number[]) {
        this.value = v;
        this.replicationGuides = rgl;
    }
}
