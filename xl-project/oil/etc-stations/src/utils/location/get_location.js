export const getLocation = (success,fail) => {
    const geolocation = new window.qq.maps.Geolocation("TPSBZ-NCDRK-E2IJH-A34QZ-DENEQ-DSBTD", "myapp")
    geolocation.getLocation(res=>{
      console.log(res)
      success(res)
    }, err=>{
      console.log(err)
      fail(err)
    }, {})
}

export const a = ''