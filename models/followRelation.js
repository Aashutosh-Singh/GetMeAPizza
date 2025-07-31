import mongoose from "mongoose"
const {Schema,model}=mongoose;
const followRelationSchema=new Schema({
    follower:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    following:{type:mongoose.Schema.Types.ObjectId, ref:'user',required:true},

},{
    indexes:[
        {follower:1},
        {following:1},
        {follower:1,following:1,unique:true}
    ]
});
export default mongoose.models.Followrelation || model('Followrelation',followRelationSchema);