# TSX watch bug

This is to test the tsx watch mode in Windows.

```
docker compose up --build
```

## Test scenarios 1

**Steps:** Make changes to `services/api/src/index.ts` on host machine  
**Expect:** TSX sees the change and restarts the process  
**Observed:** This should work as expected.

## Test scenarios 2

**Steps:** Press <kbd>CTRL + C</kbd> to stop docker  
**Expect:** The underlying process should exit almost immediately, indicating it received the signal.  
**Observed:** npm/npx does not forward signals properly for npm >=9.6.7 <10.3.0 (https://github.com/npm/cli/issues/6684)
