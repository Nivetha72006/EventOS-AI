class BasePrompt {

    build(system:string,data:any){

        return `

${system}

DATA:

${JSON.stringify(data,null,2)}

Return only JSON.

`;

    }

}

export default new BasePrompt();