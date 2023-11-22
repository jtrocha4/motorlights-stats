const excelStyles = {
  reportDetailedStyle: {
    alignment: { horizontal: 'center', vertical: 'center' },
    font: {
      name: 'MS Sans Serif',
      bold: true,
      color: { rgb: '000080' }
    }
  },

  // Black
  headerBlackStyle: {
    fill: { fgColor: { rgb: '000000' } },
    alignment: { horizontal: 'left' },
    font: {
      name: 'MS Sans Serif',
      bold: true,
      color: { rgb: 'FFFFFF' }
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  blackStyleCurrencyFormat: {
    numFmt: '"$"#,##0.00;[Red]("$"#,##0.00)',
    fill: { fgColor: { rgb: '000000' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true,
      color: { rgb: 'FFFFFF' }
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },

  // Gray
  headerGrayStyle: {
    fill: { fgColor: { rgb: 'BFBFBF' } },
    alignment: { horizontal: 'left' },
    font: {
      name: 'MS Sans Serif',
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  grayStyleCurrencyFormat: {
    numFmt: '"$"#,##0.00;[Red]("$"#,##0.00)',
    fill: { fgColor: { rgb: 'BFBFBF' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  grayStyleNumberFormat: {
    numFmt: '0',
    fill: { fgColor: { rgb: 'BFBFBF' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  percentageGrayStyle: {
    numFmt: '0.0%',
    fill: { fgColor: { rgb: 'BFBFBF' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },

  // Green
  headerGreenStyle: {
    fill: { fgColor: { rgb: '92D050' } },
    alignment: { horizontal: 'left' },
    font: {
      name: 'MS Sans Serif',
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },

  // Orange
  headerOrangeStyle: {
    fill: { fgColor: { rgb: 'F79646' } },
    alignment: { horizontal: 'left' },
    font: {
      name: 'MS Sans Serif',
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  orangeStyleNumberFormat: {
    numFmt: '0',
    fill: { fgColor: { rgb: 'F79646' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  orangeStyleCurrencyFormat: {
    numFmt: '"$"#,##0.00;[Red]("$"#,##0.00)',
    fill: { fgColor: { rgb: 'F79646' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  percentageOrangeStyle: {
    numFmt: '0.0%',
    fill: { fgColor: { rgb: 'F79646' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },

  // White
  headerWhiteStyle: {
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'left' },
    font: {
      name: 'MS Sans Serif',
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  whiteStyleNumberFormat: {
    numFmt: '0',
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  whiteRowStyleNumberFormat: {
    numFmt: '0',
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'left' },
    font: {
      bold: false
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  whiteStyleCurrencyFormat: {
    numFmt: '"$"#,##0.00;[Red]("$"#,##0.00)',
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  whiteRowStyleCurrencyFormat: {
    numFmt: '"$"#,##0.00;[Red]("$"#,##0.00)',
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: false
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  percentageWhiteStyle: {
    numFmt: '0.0%',
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  whiteStyleTextFormat: {
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'right' },
    font: {
      name: 'MS Sans Serif',
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  whiteRowStyleTextFormat: {
    fill: { fgColor: { rgb: 'FFFFFF' } },
    alignment: { horizontal: 'left' },
    font: {
      name: 'MS Sans Serif',
      bold: false
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },

  // Yellow
  headerYellowStyle: {
    fill: { fgColor: { rgb: 'FFFF00' } },
    alignment: { horizontal: 'left' },
    font: {
      name: 'MS Sans Serif',
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  yellowStyleCurrencyFormat: {
    numFmt: '"$"#,##0.00;[Red]("$"#,##0.00)',
    fill: { fgColor: { rgb: 'FFFF00' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  },
  percentageYellowStyle: {
    numFmt: '0.0%',
    fill: { fgColor: { rgb: 'FFFF00' } },
    alignment: { horizontal: 'right' },
    font: {
      bold: true
    },
    border: {
      right: {
        style: 'thin',
        color: '000000'
      },
      left: {
        style: 'thin',
        color: '000000'
      },
      top: {
        style: 'thin',
        color: '000000'
      },
      bottom: {
        style: 'thin',
        color: '000000'
      }
    }
  }

}

export default excelStyles
