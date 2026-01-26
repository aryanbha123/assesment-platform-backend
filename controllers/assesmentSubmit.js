export const submitSection = async (req, res) => {
  try {
    const {submissionId, sectionId,sectionType, response  ,current , autoSubmit} = req.body;

    const userSolution = await ExamSolution.findById(submissionId);

    if(userSolution.testSnapshot.length == current + 1) {
      userSolution.isSubmitted = true;
    }
    userSolution.currSection = current + 1;
    // if(sectionType == 'quiz') {

      //webhook call
    // }else{
      //webhook call
    // }
    // if(autoSubmit) userSolution.isSubmitted = true;
    await userSolution.save();
    
    await axios.post(`${EVALUATOR_API}/weebhooks/exam/eval/test` , {data:{
      submissionId, sectionId,sectionType, response  ,current
    }} );
    return res.json({message:"Section Submitted ", nextSection:userSolution.isSubmitted?-1:current+1, submitted:userSolution.isSubmitted})
  } catch (error) {
    console.log(error)
    return res.json({message:"Internal Server Error"})
  }
}