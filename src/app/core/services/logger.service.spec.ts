import { TestBed } from '@angular/core/testing';
import { LoggerService, LogLevel } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleLogSpy: jasmine.Spy;
  let consoleInfoSpy: jasmine.Spy;
  let consoleWarnSpy: jasmine.Spy;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);

    // Spy on console methods
    consoleLogSpy = spyOn(console, 'log');
    consoleInfoSpy = spyOn(console, 'info');
    consoleWarnSpy = spyOn(console, 'warn');
    consoleErrorSpy = spyOn(console, 'error');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('debug', () => {
    it('should log debug messages when log level is DEBUG', () => {
      service.setLogLevel(LogLevel.DEBUG);
      service.setConsoleLogging(true);
      
      service.debug('Test debug message', { data: 'test' });
      
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy.calls.mostRecent().args[0]).toContain('[DEBUG]');
      expect(consoleLogSpy.calls.mostRecent().args[0]).toContain('Test debug message');
    });

    it('should not log debug messages when log level is INFO', () => {
      service.setLogLevel(LogLevel.INFO);
      service.setConsoleLogging(true);
      
      service.debug('Test debug message');
      
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      service.setLogLevel(LogLevel.INFO);
      service.setConsoleLogging(true);
      
      service.info('Test info message', { data: 'test' });
      
      expect(consoleInfoSpy).toHaveBeenCalled();
      expect(consoleInfoSpy.calls.mostRecent().args[0]).toContain('[INFO]');
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      service.setLogLevel(LogLevel.WARN);
      service.setConsoleLogging(true);
      
      service.warn('Test warning message');
      
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleWarnSpy.calls.mostRecent().args[0]).toContain('[WARN]');
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      service.setLogLevel(LogLevel.ERROR);
      service.setConsoleLogging(true);
      
      const error = new Error('Test error');
      service.error('Test error message', error);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.calls.mostRecent().args[0]).toContain('[ERROR]');
    });
  });

  describe('logApiRequest', () => {
    it('should log API requests', () => {
      service.setLogLevel(LogLevel.DEBUG);
      service.setConsoleLogging(true);
      
      service.logApiRequest('POST', '/api/login', { username: 'test' });
      
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy.calls.mostRecent().args[0]).toContain('[API REQUEST]');
      expect(consoleLogSpy.calls.mostRecent().args[0]).toContain('POST');
    });
  });

  describe('logApiResponse', () => {
    it('should log API responses', () => {
      service.setLogLevel(LogLevel.DEBUG);
      service.setConsoleLogging(true);
      
      service.logApiResponse('POST', '/api/login', 200, { success: true });
      
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(consoleLogSpy.calls.mostRecent().args[0]).toContain('[API RESPONSE]');
      expect(consoleLogSpy.calls.mostRecent().args[0]).toContain('200');
    });
  });

  describe('setLogLevel', () => {
    it('should change log level dynamically', () => {
      service.setLogLevel(LogLevel.ERROR);
      service.setConsoleLogging(true);
      
      service.debug('Should not log');
      service.info('Should not log');
      service.warn('Should not log');
      service.error('Should log');
      
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('setConsoleLogging', () => {
    it('should disable console logging when set to false', () => {
      service.setLogLevel(LogLevel.DEBUG);
      service.setConsoleLogging(false);
      
      service.debug('Should not log');
      service.info('Should not log');
      service.warn('Should not log');
      service.error('Should not log');
      
      expect(consoleLogSpy).not.toHaveBeenCalled();
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('createLogEntry', () => {
    it('should create structured log entry', () => {
      const entry = service.createLogEntry('INFO', 'Test message', { data: 'test' });
      
      expect(entry).toBeDefined();
      expect(entry.level).toBe('INFO');
      expect(entry.message).toBe('Test message');
      expect(entry.data).toEqual({ data: 'test' });
      expect(entry.timestamp).toBeDefined();
      expect(entry.userAgent).toBeDefined();
      expect(entry.url).toBeDefined();
    });
  });
});
