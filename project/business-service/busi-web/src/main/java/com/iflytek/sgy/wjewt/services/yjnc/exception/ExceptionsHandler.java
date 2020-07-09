package com.iflytek.sgy.wjewt.services.yjnc.exception;

import com.iflytek.sgy.wjewt.base.ResultMsg;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.iflytek.sgy.wjewt.services.base.BaseException;

@ControllerAdvice
public final class ExceptionsHandler {
    protected final Logger logger = LoggerFactory.getLogger(getClass());

    @ExceptionHandler(Exception.class)
    @ResponseBody
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResultMsg exceptionHandler(Exception exception) {
        logger.warn("加载错误", exception);
        if (exception instanceof IllegalArgumentException) {
            return ResultMsg.fail(ErrorEnum.ILLEGAL_ARGUMENT.getMessage(), exception);
        } else if (exception instanceof RuntimeException) {
            return ResultMsg.fail(ErrorEnum.INTERNAL_SERVER_ERROR.getMessage(), exception);
        } else {
            return  ResultMsg.fail(ErrorEnum.LOAD_ERROR.getMessage(), exception);
        }
    }

    @ExceptionHandler(BaseException.class)
    @ResponseBody
//	@ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResultMsg baseExceptionHandler(BaseException exception) {
        logger.info("捕获业务异常", exception);
        ResultMsg errorResult = ResultMsg.fail(exception.getMessage(), exception);
        return errorResult;
    }
}
