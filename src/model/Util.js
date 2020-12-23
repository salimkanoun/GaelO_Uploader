/**
 Copyright (C) 2018-2020 KANOUN Salim
 This program is free software; you can redistribute it and/or modify
 it under the terms of the Affero GNU General Public v.3 License as published by
 the Free Software Foundation;
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 Affero GNU General Public Public for more details.
 You should have received a copy of the Affero GNU General Public Public along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

export default class Util {
  /**
   * Format date for display
   * @param {Date} date
   * @return {Date}
   */
  static fDate(date) {

    if (date === undefined) {
      return ''
    }
    let res = ''

    if (typeof date === 'string') {
      const dateStr = date
      if (dateStr.split('-').length !== 3) {
        return '????-??-??'
      }
      date = {}
      date.year = dateStr.split('-')[0]
      date.month = dateStr.split('-')[1]
      date.day = dateStr.split('-')[2]
    }

    if (date.day !== undefined || date.month !== undefined || date.year !== undefined) {
      if (parseInt(date.year) !== 0 && !isNaN(parseInt(date.year))) {
        res += Util.intToString(date.year, 4) + '-'
      } else {
        res += '****-'
      }

      if (parseInt(date.month) !== 0 && !isNaN(parseInt(date.month))) {
        res += Util.intToString(date.month, 2) + '-'
      } else {
        res += '**-'
      }

      if (parseInt(date.day) !== 0 && !isNaN(parseInt(date.day))) {
        res += Util.intToString(date.day, 2)
      } else {
        res += '**'
      }
    }
    return res
  }

  /**
   * Format DICOM dates to English format
   * @param {Date} rawDate 
   * @return {Boolean}
   */
  static formatRawDate(rawDate) {
      if(rawDate === '') return rawDate
      else return (rawDate.substring(4, 6) + '-' + rawDate.substring(6, 8) + '-' + rawDate.substring(0, 4))
  }

  /**
   * Check equality of two dates that may be uncomplete
   * (with missing informations such as month or day)
   * @param {Date} d1
   * @param {Date} d2
   * @return {Boolean}
   */
  static isProbablyEqualDates(d1, d2) {
    if (d1 === d2) return true

    d1 = Util.fDate(d1)
    d2 = Util.fDate(d2)

    if (d1 === '????-??-??' || d2 === '????-??-??') {
      return false
    }

    d1 = d1.split('-')
    d2 = d2.split('-')

    if (d1[0] !== '****' && d2[0] !== '****' && d1[0] !== d2[0]) {
      return false
    }

    if (d1[1] !== '**' && d2[1] !== '**' && d1[1] !== d2[1]) {
      return false
    }

    if (d1[2] !== '**' && d2[2] !== '**' && d1[2] !== d2[2]) {
      return false
    }
    return true
  }

  /**
   * Format string to a specified length string
   * @param {Integer} integer
   * @param {Integer} digits
   * @return {String}
   */
  static intToString(integer, digits) {
    while (integer.toString().length < digits) {
      integer = '0' + integer
    }
    return integer
  }

  /**
   * Search for an object in an Array of Objects
   * using the key of wanted object
   * @param {Array} array
   * @param {*} objectKey
   * @param {*} key
   * @return {Boolean}
   */
  static arrayIncludesObject(array, objectKey, key) {
    for (const i in array) {
      if (array[i][objectKey] === key) return true
    }
    return false
  }

  /**
   * Check if an object is empty
   * @param {Object} obj 
   * @return {Boolean}
   */
  static isEmptyObject(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  /**
   * Figure if two fields are equals
   * If one string is empty, strings are considered equal
   * @param {String} str1 
   * @param {String} str2
   * @return {Boolean} 
   */
  static areEqualFields(str1, str2) {
    str1 = str1.toUpperCase()
    str2 = str2.toUpperCase()
    if (str1 === undefined || str2 === undefined || str1 === '' || str2 === '' || str1 === null || str2 === null) return true
    if (str1.localeCompare(str2) === 0) return true
    return false 
  }
}


