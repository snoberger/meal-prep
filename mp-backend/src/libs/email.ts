// eslint-disable-next-line
export const generateTemplate = function(template: string, options: any): string {
    switch(template) {
    case "grocery-list":
        return `
                    <h4>Items</h4>
                    <div>${options as string}</div>
                `
    default: return ''
    }
}