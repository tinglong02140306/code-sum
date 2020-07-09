export function isRightJobGroup(job_group) {
    const reg=/^[0-9a-zA-Z]+$/;
    if (reg.test(job_group)){
        return true;
    } else {
        return false;
    }
}