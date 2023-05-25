<?php

// autoload_real.php @generated by Composer

class ComposerAutoloaderInitb8aa8dd8dba1b8a35922e4abcca997a9
{
    private static $loader;

    public static function loadClassLoader($class)
    {
        if ('Composer\Autoload\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }

    /**
     * @return \Composer\Autoload\ClassLoader
     */
    public static function getLoader()
    {
        if (null !== self::$loader) {
            return self::$loader;
        }

        require __DIR__ . '/platform_check.php';

        spl_autoload_register(array('ComposerAutoloaderInitb8aa8dd8dba1b8a35922e4abcca997a9', 'loadClassLoader'), true, true);
        self::$loader = $loader = new \Composer\Autoload\ClassLoader(\dirname(__DIR__));
        spl_autoload_unregister(array('ComposerAutoloaderInitb8aa8dd8dba1b8a35922e4abcca997a9', 'loadClassLoader'));

        require __DIR__ . '/autoload_static.php';
        call_user_func(\Composer\Autoload\ComposerStaticInitb8aa8dd8dba1b8a35922e4abcca997a9::getInitializer($loader));

        $loader->register(true);

        return $loader;
    }
}
