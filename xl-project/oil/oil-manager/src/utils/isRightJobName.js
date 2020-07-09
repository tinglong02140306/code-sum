export function isRightJobName(job_name) {
    const reg=/^[0-9a-zA-Z.]+$/;
    if (reg.test(job_name)){
        if (job_name.indexOf(".")!==-1){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}