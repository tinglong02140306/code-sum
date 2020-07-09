package com.iflytek.sgy.wjewt.util;

import com.iflytek.sgy.wjewt.base.SysCode;
import com.iflytek.sgy.wjewt.domain.entity.ServiceYjncApply;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;

import javax.servlet.ServletOutputStream;
import java.awt.Color;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.DateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

public class ExportUtil {

    /**
     * 导出文件名
     */
    private String fileName;

    public ExportUtil(String fileName) {
        this.fileName = fileName;
    }

    /**
     * 将指定对象的数组导出EXCEL
     * @param list
     *      数组数据
     * @param titles
     *      标题
     * @param fields
     *      属性列
     * @param outputStream
     *      输出流
     * @param serializeNumber
     *      是否添加序号
     */
    public  <T> void exportExcel(List<T> list, String[] titles, String[] fields, ServletOutputStream outputStream, boolean serializeNumber,String excuteMethod) {
        // 创建一个workbook 对应一个excel应用文件
        XSSFWorkbook workBook = new XSSFWorkbook();
        // 在workbook中添加一个sheet,对应Excel文件中的sheet
        XSSFSheet sheet = workBook.createSheet("数据第一页");

        XSSFCellStyle headStyle = getHeadStyle(workBook);
        XSSFCellStyle noWrapCell = getBodyStyle(workBook,false);
        XSSFCellStyle wrapCell = getBodyStyle(workBook,true);
        // 构建表头
        XSSFRow headRow = sheet.createRow(0);
        XSSFCell cell = null;
        for (int i = 0; i < titles.length; i++) {
            cell = headRow.createCell(i);
            cell.setCellStyle(headStyle);
            cell.setCellValue(titles[i]);
        }
        // 构建表体数据
        if (list != null && list.size() > 0) {
            try {
                //遍历数据记录
                for (int j = 0; j < list.size(); j++) {
                    T t = list.get(j);

                    if (StringUtils.isNotBlank(excuteMethod)){
                       Method method = t.getClass().getDeclaredMethod(excuteMethod);
                       method.setAccessible(true);
                       method.invoke(t);
                    }

                    XSSFRow bodyRow = sheet.createRow(j + 1);
                    //如果有序号
                    if (serializeNumber) {
                        cell = bodyRow.createCell(0);
                        cell.setCellStyle(noWrapCell);
                        cell.setCellValue(j + 1);
                    }
                    //如果有序号，则从第二个开始，第一格填充序号
                    for (int index = 0; index < fields.length; index++) {
                        Object value;
                        if (t instanceof Map){
                            value = ((Map) t).get(fields[index]);
                        }else {
                            Field field  = t.getClass().getDeclaredField(fields[index]);
                            field.setAccessible(true);
                            value = field.get(t);
                        }
                        cell = bodyRow.createCell(serializeNumber ? index + 1 : index);
                        cell.setCellStyle(index == 0 ? wrapCell:noWrapCell);
                        setCellValue(cell,value);
                    }
                }
                sheet.autoSizeColumn(0);
                sheet.autoSizeColumn(1);
                sheet.autoSizeColumn(2);
                sheet.autoSizeColumn(3);
                sheet.autoSizeColumn(4);
                sheet.autoSizeColumn(5);
                sheet.autoSizeColumn(6);
            } catch (NoSuchFieldException | IllegalAccessException|NoSuchMethodException |InvocationTargetException e) {
                e.printStackTrace();
            }
            try (ServletOutputStream servletOutputStream = outputStream) {
                workBook.write(servletOutputStream);
                outputStream.flush();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 设置单元格数据
     * @param value
     */
    public void  setCellValue(XSSFCell cell,Object value){
        if (value == null) {
            cell.setCellValue("-");
        }
        if (value instanceof String) {
            cell.setCellValue((String) value);
        } else if (value instanceof Date) {
            DateFormat dateFormat = SysCode.DATE_FORMATTER.FORMATTER_M;
            cell.setCellValue(dateFormat.format((Date)value));
        } else if (value instanceof Long || value instanceof Double || value instanceof Integer){
            cell.setCellValue((Double)value);
        }else if (value instanceof Boolean){
            cell.setCellValue((Boolean)value);
        }else {
            cell.setCellValue("-");
        }
    }


    /**
     * 合并单元格后给合并后的单元格加边框
     *
     * @param region
     * @param cs
     */
    public void setRegionStyle(CellRangeAddress region, XSSFCellStyle cs, XSSFSheet sheet) {

        int toprowNum = region.getFirstRow();
        for (int i = toprowNum; i <= region.getLastRow(); i++) {
            XSSFRow row = sheet.getRow(i);
            for (int j = region.getFirstColumn(); j <= region.getLastColumn(); j++) {
                XSSFCell cell = row.getCell(j);// XSSFCellUtil.getCell(row,
                // (short) j);
                cell.setCellStyle(cs);
            }
        }
    }

    /**
     * 设置表头的单元格样式
     *
     * @return
     */
    public XSSFCellStyle getHeadStyle(XSSFWorkbook wb) {
        // 创建单元格样式
        XSSFCellStyle cellStyle = wb.createCellStyle();
        // 设置单元格的背景颜色为淡蓝色
        cellStyle.setFillForegroundColor(new XSSFColor(Color.WHITE));
        cellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        // 设置单元格居中对齐
        cellStyle.setAlignment(HorizontalAlignment.CENTER);
        // 设置单元格垂直居中对齐
        cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        // 创建单元格内容显示不下时自动换行
//        cellStyle.setWrapText(true);
        // 设置单元格字体样式
        XSSFFont font = wb.createFont();
        // 设置字体加粗
        font.setFontName("Arial");
        cellStyle.setFont(font);
        // 设置单元格边框为细线条
        cellStyle.setBorderLeft(BorderStyle.THIN);
        cellStyle.setBorderBottom(BorderStyle.THIN);
        cellStyle.setBorderRight(BorderStyle.THIN);
        cellStyle.setBorderTop(BorderStyle.THIN);
        return cellStyle;
    }

    /**
     * 设置表体的单元格样式
     *
     * @return
     */
    public XSSFCellStyle getBodyStyle(XSSFWorkbook workbook,boolean wrapText) {
        // 创建单元格样式
        XSSFCellStyle cellStyle = workbook.createCellStyle();
        // 设置单元格居中对齐
        cellStyle.setAlignment(HorizontalAlignment.LEFT);
        // 设置单元格垂直居中对齐
        cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        // 创建单元格内容显示不下时自动换行
        cellStyle.setWrapText(wrapText);
        // 设置单元格字体样式
        XSSFFont font = workbook.createFont();
        // 设置字体加粗
        font.setFontName("Arial");
        cellStyle.setFont(font);
        // 设置单元格边框为细线条
        cellStyle.setBorderLeft(BorderStyle.THIN);
        cellStyle.setBorderBottom(BorderStyle.THIN);
        cellStyle.setBorderRight(BorderStyle.THIN);
        cellStyle.setBorderTop(BorderStyle.THIN);
        return cellStyle;
    }
}
