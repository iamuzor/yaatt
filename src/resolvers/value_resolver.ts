export interface ValueResolver {
    /**
     * Name of the resolver
     */
    readonly name: string
    /**
     * Description of the resolver ie. what does it resolve?
     */
    readonly description: string

    resolve(data: string): string
}


