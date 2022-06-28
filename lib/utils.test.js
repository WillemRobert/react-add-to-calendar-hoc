"use strict";

var _moment = _interopRequireDefault(require("moment"));

var _enums = require("./enums");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var testEvent = {
  description: 'Description of event. Going to have a lot of fun doing things that we scheduled ahead of time.',
  duration: '0200',
  endDatetime: '20150126T020000+00:00',
  location: 'NYC',
  startDatetime: '20150126T000000+00:00',
  title: 'Super Fun Event'
};
var expectedOutputs = {
  google: 'https://calendar.google.com/calendar/render?action=TEMPLATE&dates=20150126T000000Z/20150126T020000Z&location=NYC&text=Super%20Fun%20Event&details=Description%20of%20event.%20Going%20to%20have%20a%20lot%20of%20fun%20doing%20things%20that%20we%20scheduled%20ahead%20of%20time.',
  yahoo: 'https://calendar.yahoo.com/?v=60&view=d&type=20&title=Super%20Fun%20Event&st=20150126T000000Z&dur=0200&desc=Description%20of%20event.%20Going%20to%20have%20a%20lot%20of%20fun%20doing%20things%20that%20we%20scheduled%20ahead%20of%20time.&in_loc=NYC',
  ics: 'BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nURL:http://localhost/\nMETHOD:PUBLISH\nDTSTART:20150126T000000Z\nDTEND:20150126T020000Z\nSUMMARY:Super Fun Event\nDESCRIPTION:Description of event. Going to have a lot of fun doing things that we scheduled ahead of time.\nLOCATION:NYC\nEND:VEVENT\nEND:VCALENDAR',
  icsMobile: 'data:text/calendar;charset=utf8,BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nURL:http://localhost/\nMETHOD:PUBLISH\nDTSTART:20150126T000000Z\nDTEND:20150126T020000Z\nSUMMARY:Super Fun Event\nDESCRIPTION:Description of event. Going to have a lot of fun doing things that we scheduled ahead of time.\nLOCATION:NYC\nEND:VEVENT\nEND:VCALENDAR'
};
describe('formatDate', function () {
  it('replaces +00:00 from a date string with Z', function () {
    expect((0, _utils.formatDate)('20180603T172721+00:00')).toEqual('20180603T172721Z');
  });
});
describe('formatDuration', function () {
  it('converts number 2 to string 0200', function () {
    expect((0, _utils.formatDuration)(2)).toEqual('0200');
  });
  it('converts number 2.25 to 0225', function () {
    expect((0, _utils.formatDuration)(2.25)).toEqual('0225');
  });
  it('returns string 0200 as it was received', function () {
    expect((0, _utils.formatDuration)('0200')).toEqual('0200');
  });
});
describe('buildShareUrl', function () {
  describe('Google', function () {
    it('returns a proper Google share URL', function () {
      var result = (0, _utils.buildShareUrl)(testEvent, _enums.SHARE_SITES.GOOGLE);
      expect(result).toEqual(expectedOutputs.google);
    });
  });
  describe('Yahoo', function () {
    it('returns a proper Yahoo share URL', function () {
      var result = (0, _utils.buildShareUrl)(testEvent, _enums.SHARE_SITES.YAHOO);
      expect(result).toEqual(expectedOutputs.yahoo);
    });
    it('returns a proper Yahoo share URL when duration is a number', function () {
      var result = (0, _utils.buildShareUrl)(_objectSpread({}, testEvent, {
        duration: 2
      }), _enums.SHARE_SITES.YAHOO);
      expect(result).toEqual(expectedOutputs.yahoo);
    });
  });
  describe('iCal', function () {
    it('returns a proper iCal content object', function () {
      var result = (0, _utils.buildShareUrl)(testEvent, _enums.SHARE_SITES.ICAL);
      expect(result).toEqual(expectedOutputs.ics);
    });
    it('prepends a data URL when userAgent is mobile', function () {
      navigator.__defineGetter__('userAgent', function () {
        return "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";
      });

      var result = (0, _utils.buildShareUrl)(testEvent, _enums.SHARE_SITES.ICAL);
      expect(result).toEqual(encodeURI(expectedOutputs.icsMobile));
    });
  });
});
describe('isInternetExplorer', function () {
  it('returns true is userAgent is IE 11', function () {
    navigator.__defineGetter__('userAgent', function () {
      return "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko";
    });

    var result = (0, _utils.isInternetExplorer)();
    expect(result).toBe(true);
  });
  it('returns true is userAgent is IE 10', function () {
    navigator.__defineGetter__('userAgent', function () {
      return "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; .NET4.0E; .NET4.0C; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729)";
    });

    var result = (0, _utils.isInternetExplorer)();
    expect(result).toBe(true);
  });
  it('returns true is userAgent is IE 9', function () {
    navigator.__defineGetter__('userAgent', function () {
      return "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)";
    });

    var result = (0, _utils.isInternetExplorer)();
    expect(result).toBe(true);
  });
  it('returns false is userAgent is MS Edge', function () {
    navigator.__defineGetter__('userAgent', function () {
      return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36";
    });

    var result = (0, _utils.isInternetExplorer)();
    expect(result).toBe(false);
  });
  it('returns false is userAgent is not IE', function () {
    navigator.__defineGetter__('userAgent', function () {
      return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36";
    });

    var result = (0, _utils.isInternetExplorer)();
    expect(result).toBe(false);
  });
});
describe('isMobile', function () {
  it('returns true if userAgent is iPhone', function () {
    navigator.__defineGetter__('userAgent', function () {
      return "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";
    });

    var result = (0, _utils.isMobile)();
    expect(result).toBe(true);
  });
  it('returns true if userAgent is Android', function () {
    navigator.__defineGetter__('userAgent', function () {
      return "Mozilla/5.0 (Linux; Android 8.0.0; SM-G965F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.109 Mobile Safari/537.36";
    });

    var result = (0, _utils.isMobile)();
    expect(result).toBe(true);
  });
  it('returns false if userAgent is desktop', function () {
    navigator.__defineGetter__('userAgent', function () {
      return "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36";
    });

    var result = (0, _utils.isMobile)();
    expect(result).toBe(false);
  });
});
describe('escapeICSDescription', function () {
  it('replaces carriage returns with newline characters', function () {
    var result = (0, _utils.escapeICSDescription)('Line One \r\nLine Two');
    expect(result).toEqual('Line One \\nLine Two');
  });
  it('replaces <br> characters with newline characters', function () {
    var expectedResult = 'Line One \\nLineTwo';
    expect((0, _utils.escapeICSDescription)('Line One <br>LineTwo')).toEqual(expectedResult);
    expect((0, _utils.escapeICSDescription)('Line One <br />LineTwo')).toEqual(expectedResult);
    expect((0, _utils.escapeICSDescription)('Line One <br >LineTwo')).toEqual(expectedResult);
  });
});