/**
 * Classe para ser usada quando um componente filho emite um evento para o
 * componente pai e o componente filho espera que o componente pai o notifique
 * do resultado desse evento
 */
export class CompletableEvent<EventDataType, ResultDataType = boolean> {

    constructor(
        public readonly eventData : EventDataType,
        public readonly complete : (result : ResultDataType) => void
    ){}

}