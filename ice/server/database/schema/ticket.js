import mongoose from 'mongoose'


const TicketSchema=new mongoose.Schema({
    name:String,
    ticket:String,
    expires_in:Number,
    meta:{
        createdAt:{
            type:Date,
            default:Date.now()
        },
        updatedAt:{
            type:Date,
            default:Date.now()
        }
    }
})

TicketSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createdAt=this.meta.updatedAt=Date.now()
    }else{
        this.meta.updatedAt=Date.now()
    }
    next()
})

TicketSchema.statics={
    async getTicket(){
        const token=await this.findOne({
            name:'ticket'
        }).exec()
        if(token&&token.token){
            token.ticket=token.token
        }
        return token;
    },
    async saveTicket(data){
        let ticket=await this.findOne({
            name:'ticket'
        }).exec()
        if(ticket){
            ticket.ticket=data.ticket
            ticket.expires_in=data.expires_in
        }else{
            ticket=new Ticket({
                name:'ticket',
                ticket:data.ticket,
                expires_in:data.expires_in
            })
        }
        await ticket.save()

        return data
    }
}

const Ticket=mongoose.model('Ticket',TicketSchema)